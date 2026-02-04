const restaurants = [
    {
        name: "京おばんざい 彩り",
        location: "祇園四条站步行2分鐘",
        price: "800-1000",
        category: "gion",
        categoryName: "祇園區域",
        specialties: [
            "京都傳統小菜拼盤定食",
            "季節魚料理套餐",
            "京都蔬菜天婦羅定食"
        ]
    },
    {
        name: "祇園 華舞",
        location: "祇園商店街內",
        price: "900-1100",
        category: "gion",
        categoryName: "祇園區域",
        specialties: [
            "京都風豆腐料理套餐",
            "湯葉特製定食",
            "季節蔬菜天婦羅套餐"
        ]
    },
    {
        name: "京料理 花咲",
        location: "祇園白川旁",
        price: "1000-1200",
        category: "gion",
        categoryName: "祇園區域",
        specialties: [
            "京都風西京燒魚定食",
            "季節釜飯套餐",
            "手工豆腐料理套餐"
        ]
    },
    {
        name: "阿古屋茶屋",
        location: "二年坂上",
        price: "1000",
        category: "ninenzaka",
        categoryName: "二年坂",
        specialties: [
            "茶泡飯吃到飽（20種漬物）",
            "京都抹茶甜點套餐",
            "季節茶泡飯套餐"
        ]
    },
    {
        name: "そば処 清水",
        location: "二年坂附近",
        price: "700-900",
        category: "ninenzaka",
        categoryName: "二年坂",
        specialties: [
            "手打蕎麥麵套餐",
            "天婦羅蕎麥麵",
            "特製湯豆腐配蕎麥麵"
        ]
    },
    {
        name: "京うどん 維新",
        location: "三年坂附近",
        price: "600-800",
        category: "ninenzaka",
        categoryName: "三年坂",
        specialties: [
            "京都風烏龍麵套餐",
            "炸天婦羅烏龍麵",
            "季節蔬菜天婦羅定食"
        ]
    },
    {
        name: "洋食の店 みしな",
        location: "祇園四條附近",
        price: "900-1100",
        category: "hamburg",
        categoryName: "漢堡排",
        specialties: [
            "手工製作漢堡排定食",
            "特製醬汁漢堡排",
            "炸蝦配漢堡排套餐"
        ]
    },
    {
        name: "Bistro HAKONIWA",
        location: "祇園四條站步行3分鐘",
        price: "800-1000",
        category: "hamburg",
        categoryName: "漢堡排",
        specialties: [
            "和風漢堡排定食",
            "起司漢堡排",
            "季節蔬菜配漢堡排"
        ]
    },
    {
        name: "CICON by NOHGA HOTEL",
        location: "清水寺附近",
        price: "1000-1200",
        category: "hamburg",
        categoryName: "漢堡排",
        specialties: [
            "京都和牛漢堡排",
            "黑胡椒醬汁漢堡排",
            "蘑菇奶油醬漢堡排"
        ]
    },
    {
        name: "京料理・鍋物 いふじ",
        location: "二年坂附近",
        price: "1000-1200",
        category: "sukiyaki",
        categoryName: "壽喜燒",
        specialties: [
            "近江牛壽喜燒定食",
            "京都蔬菜壽喜燒套餐",
            "特選牛肉壽喜燒"
        ]
    },
    {
        name: "祗園 牛禅",
        location: "祇園四條站步行6分鐘",
        price: "1000-1200",
        category: "sukiyaki",
        categoryName: "壽喜燒",
        specialties: [
            "國產牛壽喜燒套餐",
            "蔬菜壽喜燒定食",
            "特製醬汁壽喜燒"
        ]
    },
    {
        name: "京都円山 天正",
        location: "二年坂、三年坂附近",
        price: "900-1100",
        category: "sukiyaki",
        categoryName: "壽喜燒",
        specialties: [
            "傳統京都風壽喜燒",
            "季節野菜壽喜燒",
            "特選牛肉壽喜燒套餐"
        ]
    }
];

function createRestaurantCard(restaurant) {
    return `
    <div class="restaurant-card bg-white rounded-lg shadow-lg overflow-hidden relative">
    <div class="p-6">
        <span class="category-tag">${restaurant.categoryName}</span>
        <h3 class="text-xl font-bold mb-2">${restaurant.name}</h3>
        <p class="text-gray-600 mb-2">
        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${restaurant.location}
        </p>
        <p class="price-range text-lg font-bold mb-4">NT$ ${restaurant.price}</p>
        <div class="space-y-2">
        <h4 class="font-semibold text-gray-700">特色餐點：</h4>
        <ul class="list-disc list-inside text-gray-600">
            ${restaurant.specialties.map(item => `<li>${item}</li>`).join('')}
        </ul>
        </div>
    </div>
    </div>
`;
}

function renderRestaurants(filteredRestaurants) {
    const container = document.getElementById('restaurant-list');
    container.innerHTML = filteredRestaurants
        .map(restaurant => createRestaurantCard(restaurant))
        .join('');
}

function filterCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const filtered = category === 'all'
        ? restaurants
        : restaurants.filter(r => r.category === category);
    renderRestaurants(filtered);
}

document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.specialties.some(s => s.toLowerCase().includes(searchTerm))
    );
    renderRestaurants(filtered);
});

renderRestaurants(restaurants);
