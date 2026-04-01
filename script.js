document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("rolls-container");

  const res = await fetch("data.json");
  const data = await res.json();

  const allItems = [...data.rolls, ...data.sets];

  let items;
  const isFavoritesPage = window.location.pathname.includes("favorites");
  const isSetsPage = window.location.pathname.includes("sets");

  if (isFavoritesPage) {
    items = allItems;
  } else if (isSetsPage) {
    items = data.sets;
  } else {
    items = data.rolls;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function updateTotal() {
    if (!isFavoritesPage) return;

    let total = 0;

    favorites.forEach(favId => {
      const item = allItems.find(i => i.id === favId);
      if (item) {
        total += Number(item.price);
      }
    });

    const totalEl = document.getElementById("total-price");
    if (totalEl) {
      totalEl.textContent = total + " ₴";
    }
  }

  items.forEach(item => {
    if (isFavoritesPage && !favorites.includes(item.id)) return;

    const card = document.createElement("div");
    card.dataset.id = item.id;

    if (isFavoritesPage) {
      card.className = "card-small";
      card.innerHTML = `
        <img src="${item.img}" class="card-small-img" alt="${item.name}">

        <div class="card-small-content">
          <div class="small-top">
            <h3>${item.name}</h3>
            <button class="like-btn" type="button">
              <img class="heart-icon" alt="favorite">
            </button>
          </div>

          <div class="small-row">
            <span class="weight">${item.weight}</span>
            <span class="price">${item.price} ₴</span>
          </div>
        </div>
      `;
    } else {
      card.className = "card";
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${item.img}" class="card-img" alt="${item.name}">

          <button class="like-btn" type="button">
            <img class="heart-icon" alt="favorite">
          </button>
        </div>

        <div class="card-content">
          <div class="top-row">
            <h3>${item.name}</h3>
            <span class="price">${item.price} ₴</span>
          </div>

          <div class="bottom-row">
            <p>${item.desc}</p>
            <span class="weight">${item.weight}</span>
          </div>
        </div>
      `;
    }

    container.appendChild(card);
  });

  document.querySelectorAll(".like-btn").forEach(btn => {
    const card = btn.closest("[data-id]");
    const id = card.dataset.id;
    const icon = btn.querySelector(".heart-icon");

    icon.src = favorites.includes(id)
      ? "icons/heart-filled.png"
      : "icons/heart-empty.png";

    btn.addEventListener("click", () => {
      if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        icon.src = "icons/heart-empty.png";

        if (isFavoritesPage) {
          card.remove();
        }
      } else {
        favorites.push(id);
        icon.src = "icons/heart-filled.png";
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      updateTotal();
    });
  });

  updateTotal();
});