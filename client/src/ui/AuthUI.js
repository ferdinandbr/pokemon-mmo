export default class AuthUI {
  constructor(onAuthSuccess) {
    this.onAuthSuccess = onAuthSuccess;
    this.token = localStorage.getItem('pokemmo_token') || null;

    this.authScreen = document.getElementById('auth-screen');
    this.tabLogin = document.getElementById('tab-login');
    this.tabRegister = document.getElementById('tab-register');
    this.formLogin = document.getElementById('form-login');
    this.formRegister = document.getElementById('form-register');
    this.loginError = document.getElementById('login-error');
    this.regError = document.getElementById('reg-error');

    this.bindEvents();
  }

  bindEvents() {
    this.tabLogin.addEventListener('click', () => this.switchTab('login'));
    this.tabRegister.addEventListener('click', () => this.switchTab('register'));

    this.formLogin.addEventListener('submit', (e) => this.handleLogin(e));
    this.formRegister.addEventListener('submit', (e) => this.handleRegister(e));
  }

  switchTab(tab) {
    this.loginError.innerText = '';
    this.regError.innerText = '';

    if (tab === 'login') {
      this.tabLogin.classList.add('active');
      this.tabRegister.classList.remove('active');
      this.formLogin.style.display = 'block';
      this.formRegister.style.display = 'none';
    } else {
      this.tabRegister.classList.add('active');
      this.tabLogin.classList.remove('active');
      this.formLogin.style.display = 'none';
      this.formRegister.style.display = 'block';
    }
  }

  setLoading(form, isLoading, buttonText) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, button');

    if (isLoading) {
      this.isSubmitting = true;
      inputs.forEach(input => input.setAttribute('disabled', 'true'));
      if (submitBtn) {
        submitBtn.dataset.originalText = submitBtn.dataset.originalText || submitBtn.innerText;
        submitBtn.innerHTML = `<span class="btn-spinner"></span> ${buttonText}`;
      }
    } else {
      this.isSubmitting = false;
      inputs.forEach(input => input.removeAttribute('disabled'));
      if (submitBtn) {
        submitBtn.innerText = buttonText || submitBtn.dataset.originalText || 'Enviar';
      }
    }
  }

  async handleLogin(e) {
    if (e) e.preventDefault();
    if (this.isSubmitting) return;

    this.loginError.innerText = '';
    this.setLoading(this.formLogin, true, 'Entrando...');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar login.');
      }

      this.token = data.token;
      localStorage.setItem('pokemmo_token', this.token);
      this.setLoading(this.formLogin, false, 'Acessar Conta');
      this.hide();
      this.onAuthSuccess(data.user, this.token);
    } catch (err) {
      this.setLoading(this.formLogin, false, 'Acessar Conta');
      this.loginError.innerText = err.message;
    }
  }

  async handleRegister(e) {
    if (e) e.preventDefault();
    if (this.isSubmitting) return;

    this.regError.innerText = '';
    this.setLoading(this.formRegister, true, 'Criando Conta...');

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar cadastro.');
      }

      this.token = data.token;
      localStorage.setItem('pokemmo_token', this.token);
      this.setLoading(this.formRegister, false, 'Criar Minha Conta');
      this.hide();
      this.onAuthSuccess(data.user, this.token);
    } catch (err) {
      this.setLoading(this.formRegister, false, 'Criar Minha Conta');
      this.regError.innerText = err.message;
    }
  }

  async checkExistingSession() {
    if (!this.token) {
      this.show();
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) {
        throw new Error('Sessão expirada');
      }

      const user = await res.json();
      this.hide();
      this.onAuthSuccess(user, this.token);
    } catch (err) {
      localStorage.removeItem('pokemmo_token');
      this.token = null;
      this.show();
    }
  }

  show() {
    this.authScreen.classList.remove('hidden');
  }

  hide() {
    this.authScreen.classList.add('hidden');
  }

  logout() {
    localStorage.removeItem('pokemmo_token');
    this.token = null;
    this.show();
  }
}
