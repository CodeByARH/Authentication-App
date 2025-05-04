from flask import Flask, request, redirect, render_template, session, url_for
from config import Config
from models import db, User
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = Config.SECRET_KEY
app.permanent_session_lifetime = timedelta(minutes=15)

db.init_app(app)

# Initialize the database within the application context
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            return 'User exists'
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        uri = user.get_totp_uri()
        return render_template('totp.html', uri=uri, secret=user.otp_secret)
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return 'Invalid credentials'
        session['username'] = username
        session.permanent = True
        return redirect(url_for('verify'))
    return render_template('login.html')

@app.route('/verify', methods=['GET', 'POST'])
def verify():
    username = session.get('username')
    if not username:
        return redirect(url_for('login'))
    user = User.query.filter_by(username=username).first()
    if request.method == 'POST':
        token = request.form['token']
        if user.verify_totp(token):
            return redirect(url_for('dashboard'))
        return 'Invalid 2FA code'
    return render_template('verify.html')

@app.route('/dashboard')
def dashboard():
    username = session.get('username')
    if not username:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=username)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
