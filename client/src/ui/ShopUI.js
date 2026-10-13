import SocketClient from '../network/SocketClient';
import { DEFAULT_MART_ITEMS } from '../maps/npcConfig';

export default class ShopUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.isOpen = false;
    this.activeNpc = null;
    this.items = DEFAULT_MART_ITEMS;
    this.selectedItemIndex = 0;
    this.quantity = 1;

    this.container = null;
    this._createDOM();
    this._bindEvents();
  }

  _createDOM() {
    let el = document.getElementById('shop-mart-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'shop-mart-modal';
      el.className = 'shop-modal hidden';
      el.innerHTML = `
        <div class="shop-backdrop"></div>
        <div class="shop-window">
          <div class="shop-header">
            <div class="shop-header-title">
              <span class="shop-icon">🛒</span>
              <span id="shop-title-text">POKÉ MART</span>
            </div>
            <div class="shop-balance">
              <span>SALDO:</span>
              <strong id="shop-player-money">₽ 0</strong>
            </div>
            <button type="button" class="shop-close-btn" id="shop-btn-close">×</button>
          </div>

          <div class="shop-body">
            <!-- Lista de Produtos -->
            <div class="shop-items-list" id="shop-items-container"></div>

            <!-- Painel de Detalhes e Compra -->
            <div class="shop-detail-panel">
              <div class="shop-detail-icon-box">
                <img id="shop-detail-img" src="/assets/items/poke-ball.png" alt="Item" />
              </div>
              <h4 id="shop-detail-name">Poké Ball</h4>
              <p id="shop-detail-desc" class="shop-detail-desc">Dispositivo de captura.</p>

              <div class="shop-qty-selector">
                <label>Quantidade:</label>
                <div class="shop-qty-controls">
                  <button type="button" class="shop-qty-btn" id="shop-qty-dec">-</button>
                  <input type="number" id="shop-qty-input" value="1" min="1" max="99" />
                  <button type="button" class="shop-qty-btn" id="shop-qty-inc">+</button>
                </div>
              </div>

              <div class="shop-total-row">
                <span>Total:</span>
                <strong id="shop-total-price">₽ 200</strong>
              </div>

              <button type="button" class="shop-buy-submit-btn" id="shop-btn-buy">COMPRAR</button>
              <div id="shop-feedback-msg" class="shop-feedback hidden"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(el);
    }

    this.container = el;
    this.itemsContainer = document.getElementById('shop-items-container');
    this.playerMoneyEl = document.getElementById('shop-player-money');
    this.detailImg = document.getElementById('shop-detail-img');
    this.detailName = document.getElementById('shop-detail-name');
    this.detailDesc = document.getElementById('shop-detail-desc');
    this.qtyInput = document.getElementById('shop-qty-input');
    this.totalPriceEl = document.getElementById('shop-total-price');
    this.feedbackEl = document.getElementById('shop-feedback-msg');
  }

  _bindEvents() {
    document.getElementById('shop-btn-close')?.addEventListener('click', () => this.close());
    this.container.querySelector('.shop-backdrop')?.addEventListener('click', () => this.close());

    document.getElementById('shop-qty-dec')?.addEventListener('click', () => {
      this.setQuantity(Math.max(1, this.quantity - 1));
    });
    document.getElementById('shop-qty-inc')?.addEventListener('click', () => {
      this.setQuantity(Math.min(99, this.quantity + 1));
    });
    this.qtyInput?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 1;
      this.setQuantity(Math.max(1, Math.min(99, val)));
    });

    document.getElementById('shop-btn-buy')?.addEventListener('click', () => this.submitBuy());

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });
  }

  open(npc = null) {
    this.activeNpc = npc;
    this.isOpen = true;
    this.selectedItemIndex = 0;
    this.quantity = 1;
    this.items = (npc?.shopItems && Array.isArray(npc.shopItems) && npc.shopItems.length > 0)
      ? npc.shopItems
      : DEFAULT_MART_ITEMS;

    this.container.classList.remove('hidden');
    this.updateMoneyDisplay();
    this.renderItemList();
    this.updateDetail();
    this.clearFeedback();
  }

  close() {
    this.isOpen = false;
    this.container.classList.add('hidden');
  }

  updateMoneyDisplay() {
    const money = this.worldScene?.currentMoney || 0;
    if (this.playerMoneyEl) {
      this.playerMoneyEl.innerText = `₽ ${money.toLocaleString('pt-BR')}`;
    }
  }

  renderItemList() {
    if (!this.itemsContainer) return;
    this.itemsContainer.innerHTML = '';

    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `shop-item-card ${index === this.selectedItemIndex ? 'active' : ''}`;
      card.innerHTML = `
        <img src="${item.icon}" alt="${item.name}" class="shop-item-icon" />
        <div class="shop-item-info">
          <span class="shop-item-name">${item.name}</span>
          <span class="shop-item-price">₽ ${item.price.toLocaleString('pt-BR')}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        this.selectedItemIndex = index;
        this.renderItemList();
        this.updateDetail();
      });
      this.itemsContainer.appendChild(card);
    });
  }

  setQuantity(qty) {
    this.quantity = qty;
    if (this.qtyInput) this.qtyInput.value = qty;
    this.updateTotalPrice();
  }

  updateDetail() {
    const item = this.items[this.selectedItemIndex];
    if (!item) return;

    if (this.detailImg) this.detailImg.src = item.icon;
    if (this.detailName) this.detailName.innerText = item.name;
    if (this.detailDesc) this.detailDesc.innerText = item.desc || '';

    this.setQuantity(1);
  }

  updateTotalPrice() {
    const item = this.items[this.selectedItemIndex];
    if (!item) return;
    const total = item.price * this.quantity;
    if (this.totalPriceEl) {
      this.totalPriceEl.innerText = `₽ ${total.toLocaleString('pt-BR')}`;
    }
  }

  clearFeedback() {
    if (this.feedbackEl) {
      this.feedbackEl.classList.add('hidden');
      this.feedbackEl.innerText = '';
    }
  }

  showFeedback(msg, isError = false) {
    if (!this.feedbackEl) return;
    this.feedbackEl.classList.remove('hidden');
    this.feedbackEl.className = `shop-feedback ${isError ? 'error' : 'success'}`;
    this.feedbackEl.innerText = msg;
  }

  submitBuy() {
    const item = this.items[this.selectedItemIndex];
    if (!item) return;

    const totalCost = item.price * this.quantity;
    const curMoney = this.worldScene?.currentMoney || 0;

    if (curMoney < totalCost) {
      this.showFeedback('Dinheiro insuficiente para esta compra!', true);
      return;
    }

    SocketClient.emit('shop:buy', {
      itemId: item.id,
      quantity: this.quantity
    }, (res) => {
      if (res && res.success) {
        if (typeof res.newMoney === 'number') {
          this.worldScene.currentMoney = res.newMoney;
          this.worldScene.onMoneyUpdated?.({ money: res.newMoney });
        }
        this.updateMoneyDisplay();
        this.showFeedback(`Comprado ${this.quantity}x ${item.name} com sucesso!`);
      } else {
        this.showFeedback(res?.message || 'Falha ao processar a compra.', true);
      }
    });
  }
}
