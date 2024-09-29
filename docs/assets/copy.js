document.addEventListener("DOMContentLoaded", function() {
    // 加载Clipboard.js库
    let clipboardScript = document.createElement('script');
    clipboardScript.type = 'text/javascript';
    clipboardScript.src = 'https://blog.liyifan.xyz/lib/clipboard.min.js';
    document.body.appendChild(clipboardScript);

    // 样式
    let style = document.createElement('style');
    style.innerHTML = `
        .markdown-body .highlight pre, .markdown-body pre {
            position: relative;
        }

        .copy-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #ffffff; 
            border: 1px solid #ddd; 
            cursor: pointer;
            border-radius: 5px; 
            display: flex;
            align-items: center;
        }

        pre.notranslate .copy-button:hover {
            background-color: #f5f5f5; 
        }

        pre.notranslate .copied {
            border: 1px solid #008000; 
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 12px;
            border-radius: 5px; 
            display: flex;
            align-items: center;
        }

        pre.notranslate .copied svg {
            color: #008000; 
        }
    `;
    document.head.appendChild(style);

    clipboardScript.onload = function() {
        // 获取所有代码块
        var codeBlocks = document.querySelectorAll('pre.notranslate');

        // 遍历
        codeBlocks.forEach((codeBlock) => {
            // 创建复制按钮
            var copyButton = createCopyButton();

            codeBlock.appendChild(copyButton);

            // 初始化Clipboard.js
            var clipboard = new ClipboardJS(copyButton, {
                target: function(trigger) {
                    return codeBlock;
                }
            });

            // 监听成功事件
            clipboard.on('success', function(e) {
                handleCopySuccess(copyButton);
                e.clearSelection();
            });

            // 监听代码块滚动事件
            codeBlock.addEventListener('scroll', function() {
                adjustButtonPosition(copyButton, codeBlock);
                hideButton(copyButton)
            });
        });
    };

    // 创建复制按钮
    function createCopyButton() {
        var button = document.createElement('button');
        button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon m-2">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
            </svg>
        `;
        button.classList.add('copy-button');
        return button;
    }

    // 复制成功后操作
    function handleCopySuccess(button) {
        button.innerHTML = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-copy-icon m-2">
                <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
            </svg>
        `;
        button.classList.add('copied');
        button.classList.remove('copy-button');
        setTimeout(function() {
            button.innerHTML = `
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon m-2">
                    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                </svg>
            `;
            button.classList.remove('copied');
            button.classList.add('copy-button');
        }, 1000); // 1秒
    }

    // 滚动时调整按钮位置
    function adjustButtonPosition(button, codeBlock) {
        button.style.right = (10 - codeBlock.scrollLeft) + 'px';
    }

    // 滚动时隐藏按钮
    function hideButton(button) {
        clearTimeout(button.timeout);
        button.style.display = 'none';
        button.timeout = setTimeout(function() {
            button.style.display = 'flex';
        }, 1000);
    }
});



// 填入每页显示的文章数
var itemsPerPage = 15;

//填入自定义页面的数量
var custompages = 0;

//---------------------------------------------------------------------

// XML文件路径
var xmlUrl = `${window.location.origin}/rss.xml`;

// 获取当前页数
function getCurrentPage() {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/page(\d+)\.html/);
    // console.log(match ? parseInt(match[1]) : 1);
    return match ? parseInt(match[1]) : 1;
}

// 插入页码元素，链接
function appendPageLink(pagination, pageNumber, currentPage) {
    var pageLink = document.createElement('a');
    pageLink.href = pageNumber === 1 ? `${window.location.origin}` : `${window.location.origin}/page${pageNumber}.html`;
    pageLink.textContent = pageNumber;
    if (pageNumber === currentPage) {
        pageLink.classList.add('current-page');
    }
    pagination.insertBefore(pageLink, pagination.children[pagination.children.length - 1]);
}

// 插入省略号
function appendDots(pagination) {
    var dots = document.createElement('span');
    dots.textContent = '...';
    pagination.insertBefore(dots, pagination.children[pagination.children.length - 1]);
}

// 插入分页条
function updatePagination(totalPages, currentPage) {
    var pagination = document.querySelector('.pagination');

    // 清除现有页码
    while (pagination.children.length > 2) {
        pagination.removeChild(pagination.children[1]);
    }

    if (totalPages <= 10) {
        for (var i = 1; i <= totalPages; i++) {
            appendPageLink(pagination, i, currentPage);
        }
    } else {
        appendPageLink(pagination, 1, currentPage);
        appendPageLink(pagination, 2, currentPage);
        appendPageLink(pagination, 3, currentPage);

        if (currentPage > 5) {
            appendDots(pagination);
        }

        var startPage = Math.max(4, currentPage - 2);
        var endPage = Math.min(totalPages - 3, currentPage + 2);

        for (var i = startPage; i <= endPage; i++) {
            appendPageLink(pagination, i, currentPage);
        }

        if (currentPage < totalPages - 4) {
            appendDots(pagination);
        }

        appendPageLink(pagination, totalPages - 2, currentPage);
        appendPageLink(pagination, totalPages - 1, currentPage);
        appendPageLink(pagination, totalPages, currentPage);
    }

    // 添加样式
    var style = document.createElement('style');
    style.textContent = `
        .pagination a.current-page {
            font-weight: bold;
            color: red;
            text-decoration: underline;
            font-size: 18px;
            border-color: #56539d;
        }
    `;
    document.head.appendChild(style);
}

// 主
fetch(xmlUrl)
    .then(response => response.text())
    .then(data => {
        var parser = new DOMParser();

        var xmlDoc = parser.parseFromString(data, "text/xml");

        // 查找所有item标签
        var items = xmlDoc.getElementsByTagName("item");

        // console.log(items.length);

        var itemslength = items.length - custompages;

        // 如果总条数小于等于每页显示的文章数，停止
        if (itemslength <= itemsPerPage) {
            return;
        }

        // 计算总页数
        var totalPages = Math.ceil(itemslength / itemsPerPage);

        // 获取当前页
        var currentPage = getCurrentPage();

        // 插入分页条
        updatePagination(totalPages, currentPage);
    })
    .catch(error => console.error('Error fetching XML:', error));

