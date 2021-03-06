var Searcher = (function () {
  function Searcher() {
    this.result = [];
    // ToDo: ホワイトリストの方がいい。
    this.tagsToBeExcluded = [
      'script',
      'style',
      'meta',
      'head',
      'title',
      'link',
    ];
  }

  Searcher.prototype._getElementsByText = function (text, rootTag) {
    /** @type {HTMLElement[]} */
    var elements = [];

    if (text.length === 0) return elements;

    // main タグ以下を検索
    var expression = this._makeXPathExprSearchDeepestNodeContaining(
      text,
      rootTag
    );

    var xPathResult = document.evaluate(
      expression,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    if (xPathResult.snapshotLength) {
      var length = xPathResult.snapshotLength;

      while (length--) {
        var item = xPathResult.snapshotItem(length);

        if (
          this.tagsToBeExcluded.findIndex(function (tag) {
            return tag === item.nodeName.toLowerCase();
          }) >= 0
        ) {
          // Exclude this Node
        } else {
          elements.push(item);
        }
      }
    }

    return elements;
  };

  Searcher.prototype.search = function (text, callback) {
    if (this.result.length > 0) {
      this.reset();
    }

    var elements = this._getElementsByText(text, 'main');

    if (elements && elements.length) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        this.result.push({
          element: element,
          bufferedHTML: element.innerHTML,
        });

        if (callback && typeof callback === 'function') {
          callback(element);
        }

        var htmlEscaped = this._escapeHtml(text);
        element.innerHTML = element.innerHTML.replaceAll(
          htmlEscaped,
          '<span class="search-hit-text">' + htmlEscaped + '</span>'
        );
      }
    }
  };

  Searcher.prototype.reset = function () {
    while (this.result.length) {
      var item = this.result.pop();
      item.element.innerHTML = item.bufferedHTML;
    }
  };

  /**
   * var expression =
   *   '//*[contains(text(), ' + escapeXPathExpr(text) + ')]';
   * テキストが部分一致している要素を取得する。
   * ただし、以下のような例の ipsum を検索し取得することができない。
   *
   * <div>
   *   <p>lorem</p>
   *   ipsum
   * </div>
   *
   * text() を . に置き換えると、 ipsum が検索できるが、親ノードまですべて取得してしまう。
   * var expression = '//*[contains(., ' + escapeXPathExpr(text) + ')]';
   *
   * ipsum も検索できるように下記リンク先を参考に改善した。
   * https://stackoverflow.com/questions/53906387/select-all-deepest-nodes-with-xpath-1-0-containing-text-ignoring-markup
   *
   * 完全一致: '//*[normalize-space()="ipsum" and not(./*[normalize-space()="ipsum"])]'
   * 部分一致: '//*[contains(normalize-space(), "ipsum") and not(./*[contains(normalize-space(), "ipsum")])]'
   *
   * @param {string} text 検索文字列
   * @param {string|undefined} rootTag rootTagで指定したタグ以下から検索する。未指定の場合には最上位タグ以下から検索する。
   */
  Searcher.prototype._makeXPathExprSearchDeepestNodeContaining = function (
    text,
    rootTag
  ) {
    var target = '//*';
    if (rootTag !== undefined) {
      target = '//' + rootTag + target;
    }

    return (
      target +
      '[contains(normalize-space(), ' +
      this._escapeXPathExpr(text) +
      ') and not(./*[contains(normalize-space(), ' +
      this._escapeXPathExpr(text) +
      ')])]'
    );
  };

  /**
   * XPathのエスケープ処理
   *
   * バージョン2より前のXPathはエスケープに対応していない。かつ、多くのブラウザはバージョン2のXPathに対応していない。
   * 必然的にブラウザでXPathを利用する際には自前でエスケープ処理を行う必要がある。
   *
   * https://amachang.hatenablog.com/entry/20090917/1253179486
   * XPath に文字列を埋め込むときの注意 - IT戦記 amachang (id:amachang)
   *
   * @param {string} text XPath文字列
   * @returns string エスケープされたXPath文字列
   */
  Searcher.prototype._escapeXPathExpr = function (text) {
    var matches = text.match(/[^"]+|"/g);

    function esc(t) {
      return t == '"' ? "'" + t + "'" : '"' + t + '"';
    }

    if (matches) {
      if (matches.length == 1) {
        return esc(matches[0]);
      } else {
        var results = [];
        for (var i = 0; i < matches.length; i++) {
          results.push(esc(matches[i]));
        }
        return 'concat(' + results.join(', ') + ')';
      }
    } else {
      return '""';
    }
  };

  /**
   * https://qiita.com/saekis/items/c2b41cd8940923863791
   *
   * @param {*} text
   */
  Searcher.prototype._escapeHtml = function (text) {
    return text.replace(/[&'`"<>]/g, function (match) {
      return {
        '&': '&amp;',
        "'": '&#x27;',
        '`': '&#x60;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
      }[match];
    });
  };

  return Searcher;
})();
