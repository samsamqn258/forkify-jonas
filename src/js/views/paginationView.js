import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandleClick(handle) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handle(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // 1) Trường hợp trang 1 và các trang khác
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage + 1, 'next');
    }
    // 2) Trang cuối và các trang khác
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage - 1, 'prev');
    }
    // 3) Các trang khác không phải trang 1 và trang cuối
    if (curPage < numPages) {
      return `
        ${this._generateMarkupButton(curPage - 1, 'prev')}
        ${this._generateMarkupButton(curPage + 1, 'next')}
      `;
    }
    // 4) Chỉ có duy nhất 1 trang
    return '';
  }

  _generateMarkupButton(curPage, dir) {
    return `
        <button data-goto = ${curPage} class="btn--inline pagination__btn--${dir}">
        ${
          dir === 'prev'
            ? `
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage}</span>
            `
            : `
          <span>Page ${curPage}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        `
        }
      </button>
    `;
  }
}

export default new PaginationView();
