(function () {
  function getOrCreateSubmenu(container) {
    var submenu = container.querySelector(":scope > .SubMenu");
    if (!submenu) {
      submenu = document.createElement("div");
      submenu.className = "SubMenu MenuLevel1 clearfix";

      var list = document.createElement("ul");
      list.className = "SubMenuView clearfix colelem";
      submenu.appendChild(list);
      container.appendChild(submenu);
    }

    return submenu;
  }

  function addPageLink(submenu, href, labelText) {
    var exists = Array.prototype.some.call(
      submenu.querySelectorAll("a[href]"),
      function (link) {
        return link.getAttribute("href") === href;
      }
    );

    if (exists) {
      return;
    }

    var list = submenu.querySelector(".SubMenuView") || submenu;
    var listItem = document.createElement("li");
    listItem.className = "MenuItemContainer clearfix colelem";

    var link = document.createElement("a");
    link.className =
      "nonblock nontext MenuItem MenuItemWithSubMenu borderbox clearfix grpelem";
    link.href = href;

    var label = document.createElement("div");
    label.className = "MenuItemLabel NoWrap clearfix grpelem";

    var content = document.createElement("div");
    var paragraph = document.createElement("p");
    paragraph.textContent = labelText;
    content.appendChild(paragraph);
    label.appendChild(content);

    link.appendChild(label);
    listItem.appendChild(link);
    list.appendChild(listItem);
  }

  function setupMenus() {
    var containers = document.querySelectorAll(".MenuBar .MenuItemContainer");
    var closeContainer = function (container) {
      container.classList.remove("is-open");

      var item = container.querySelector(":scope > .MenuItem");
      if (item) {
        item.setAttribute("aria-expanded", "false");
      }

      Array.prototype.forEach.call(
        container.querySelectorAll(".MenuItemContainer.is-open"),
        function (descendant) {
          descendant.classList.remove("is-open");
          var descendantItem = descendant.querySelector(":scope > .MenuItem");
          if (descendantItem) {
            descendantItem.setAttribute("aria-expanded", "false");
          }
        }
      );
    };

    Array.prototype.forEach.call(containers, function (container) {
      var item = container.querySelector(":scope > .MenuItem");

      if (!item) {
        return;
      }

      var submenu = container.querySelector(":scope > .SubMenu");
      var href = item.getAttribute("href");
      if (submenu && href) {
        var label = item.querySelector(".MenuItemLabel");
        addPageLink(submenu, href, label ? label.textContent.trim() : "HOME");
        item.removeAttribute("href");
        item.removeAttribute("data-href");
      } else if (!submenu && href === "about-us.html") {
        submenu = getOrCreateSubmenu(container);
        addPageLink(submenu, href, "ABOUT US");
        item.removeAttribute("href");
        item.removeAttribute("data-href");
      } else {
        return;
      }

      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");

      if (!submenu.id) {
        submenu.id = "responsive-submenu-" + Math.random().toString(36).slice(2);
      }

      item.setAttribute("aria-haspopup", "true");
      item.setAttribute("aria-controls", submenu.id);
      item.setAttribute("aria-expanded", "false");
    });

    document.addEventListener(
      "click",
      function (event) {
        var item = event.target.closest(".MenuBar .MenuItemContainer > .MenuItem");
        if (!item || !item.hasAttribute("aria-controls")) {
          return;
        }

        event.preventDefault();
        var container = item.parentElement;
        var opening = !container.classList.contains("is-open");
        Array.prototype.forEach.call(container.parentElement.children, function (sibling) {
          if (sibling === container || !sibling.classList.contains("is-open")) {
            return;
          }

          closeContainer(sibling);
        });

        if (opening) {
          container.classList.add("is-open");
          item.setAttribute("aria-expanded", "true");
        } else {
          closeContainer(container);
        }
      },
      true
    );

    document.addEventListener("click", function (event) {
      if (event.target.closest(".MenuBar")) {
        return;
      }

      Array.prototype.forEach.call(
        document.querySelectorAll(".MenuBar .MenuItemContainer.is-open"),
        closeContainer
      );
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      var openContainers = document.querySelectorAll(
        ".MenuBar .MenuItemContainer.is-open"
      );
      var container = openContainers[openContainers.length - 1];
      if (container) {
        closeContainer(container);
        var item = container.querySelector(":scope > .MenuItem");
        item && item.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      var item = event.target.closest(
        '.MenuBar .MenuItemContainer > .MenuItem[aria-haspopup="true"]'
      );
      if (item && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        item.click();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", setupMenus);
})();
