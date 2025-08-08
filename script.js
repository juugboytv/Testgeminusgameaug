// --- App State & Config
let state = {
    player: null,
    ui: {
        isFocused: false,
        isLayoutEditMode: false,
        selectedInventoryId: null,
        selectedGemId: null,
        activeTab: 'socket',
        activeSocketView: 'visual',
        selectedGemForSocketing: null,
        itemFilter: { category: 'All', subType: 'All', tier: 'All' },
        gemFilter: { type: 'All', grade: 'All' }
    },
    game: { combatActive: false, currentZoneTier: 1, globalJackpot: 0},
    zone: {
        name: "Silverdale",
    },
    keyState: { up: false, left: false, down: false, right: false, interact: false },
};

// GDD (Game Design Document) as Code
const GDD = {
    UNSOCKET_COST: 250,
    MAX_TIER: 20,
    FORMULAS: {
        XP_BASE: 200, XP_GROWTH_RATE: 1.12, AP_PER_LEVEL: 40, AP_VIT_MULTIPLIER: 1.5, AP_OFF_STAT_PENALTY: 0.75,
        HP_BASE: 100, HP_PER_VIT: 10, WC_DEX_SCALING: 0.0055, SC_WIS_SCALING: 0.0055, SC_DEX_SCALING_HYBRID: 0.0055,
        AC_VIT_SCALING: 0.0075, HIT_CHANCE_BASE: 90, HIT_CHANCE_DEX_SCALING: 0.05, HIT_CHANCE_WIS_SCALING: 0.05,
        CRIT_CHANCE_BASE: 5, CRIT_CHANCE_DEX_SCALING: 0.01,
        CRIT_CHANCE_WIS_SCALING: 0.01, CRIT_DAMAGE_MULTIPLIER: 1.5,
        PLAYER_DAMAGE_CONSTANT: 90, HYBRID_SPELLSTRIKE_MULTIPLIER: 0.6,
        MONSTER_DAMAGE_AC_REDUCTION_FACTOR: 0.5,
        RACIAL_POWER_SINGLE_STAT_SCALING: 0.10,
        RACIAL_POWER_DUAL_STAT_SCALING: 0.05, HYBRID_MASTERY_EFFICIENCY: 0.6,
        BASE_ITEM_CLASS_VALUE: 13, BASE_ITEM_GROWTH_RATE: 1.22
    },
    RACES: {
        human: { name: 'Human', archetype: 'True Fighter', cci: 'Sword/Sword', weights: { STR: 8, DEX: 14, VIT: 18, NTL: 5, WIS: 5 }},
        dragonborn: { name: 'Dragonborn', archetype: 'True Fighter', cci: 'Sword/Sword', weights: { STR: 18, DEX: 8, VIT: 8, NTL: 9, WIS: 7 }},
        orc: { name: 'Orc', archetype: 'True Fighter', cci: 'Mace/Mace', weights: { STR: 18, DEX: 6, VIT: 12, NTL: 2, WIS: 2 }},
        werewolf: { name: 'Werewolf', archetype: 'True Fighter', cci: 'Claw/Claw', weights: { STR: 16, DEX: 12, VIT: 18, NTL: 2, WIS: 2 }},
        minotaur: { name: 'Minotaur', archetype: 'True Fighter', cci: 'Axe/Axe', weights: { STR: 16, DEX: 8, VIT: 18, NTL: 2, WIS: 2 }},
        troll: { name: 'Troll', archetype: 'True Fighter', cci: 'Staff/Staff', weights: { STR: 14, DEX: 8, VIT: 14, NTL: 2, WIS: 2 }},
        hobbit: { name: 'Hobbit', archetype: 'True Fighter', cci: 'Dagger/Dagger', weights: { STR: 4, DEX: 20, VIT: 12, NTL: 2, WIS: 2 }},
        centaur: { name: 'Centaur', archetype: 'True Fighter', cci: 'Bow/Arrow', weights: { STR: 12, DEX: 16, VIT: 18, NTL: 2, WIS: 2 }},
        phoenix: {name: 'Phoenix', archetype: 'True Caster', cci: 'Fire/Fire', weights: { STR: 2, DEX: 4, VIT: 16, NTL: 20, WIS: 8}},
        tiefling: {name: 'Tiefling', archetype: 'True Caster', cci: 'Fire/Fire', weights: { STR: 2, DEX: 6, VIT: 6, NTL: 18, WIS: 8}},
        mermaid: { name: 'Mermaid', archetype: 'True Caster', cci: 'Cold/Cold', weights: { STR: 2, DEX: 4, VIT: 4, NTL: 16, WIS: 14 }},
        gnome: {name: 'Gnome', archetype: 'True Caster', cci: 'Earth/Earth', weights: { STR: 2, DEX: 2, VIT: 6, NTL: 12, WIS: 18 }},
        griffin: { name: 'Griffin', archetype: 'True Caster', cci: 'Air/Air', weights: { STR: 4, DEX: 4, VIT: 18, NTL: 12, WIS: 12 }},
        vampire: { name: 'Vampire', archetype: 'True Caster', cci: 'Drain/Drain', weights: { STR: 4, DEX: 12, VIT: 16, NTL: 4, WIS: 14 }},
        elf: { name: 'Elf', archetype: 'True Caster', cci: 'Arcane/Arcane', weights: { STR: 6, DEX: 14, VIT: 6, NTL: 12, WIS: 12 }},
        babayaga: {name: 'Baba Yaga', archetype: 'True Caster', cci: 'Death/Death', weights: { STR: 2, DEX: 12, VIT: 6, NTL: 18, WIS: 12}},
        dwarf: { name: 'Dwarf', archetype: 'Hybrid', cci: 'Axe/Fire', weights: { STR: 12, DEX: 8, VIT: 10, NTL: 12, WIS: 8 }},
        aasimar: { name: 'Aasimar', archetype: 'Hybrid', cci: 'Mace/Arcane', weights: { STR: 8, DEX: 4, VIT: 4, NTL: 12, WIS: 12 }},
        demon: { name: 'Demon', archetype: 'Hybrid', cci: 'Staff/Fire', weights: { STR: 16, DEX: 4, VIT: 10, NTL: 16, WIS: 4 }},
        angel: { name: 'Angel', archetype: 'Hybrid', cci: 'Sword/Arcane', weights: { STR: 9, DEX: 9, VIT: 6, NTL: 16, WIS: 10 }},
        unicorn: { name: 'Unicorn', archetype: 'Hybrid', cci: 'Sword/Death', weights: { STR: 2, DEX: 4, VIT: 6, NTL: 12, WIS: 16 }},
        halfling: { name: 'Halfling', archetype: 'Hybrid', cci: 'Staff/Arcane', weights: { STR: 4, DEX: 18, VIT: 8, NTL: 2, WIS: 18}},
        banshee: { name: 'Banshee', archetype: 'Hybrid', cci: 'Staff/Death', weights: { STR: 4, DEX: 12, VIT: 6, NTL: 18, WIS: 12 }},
        draugr: { name: 'Draugr', archetype: 'Hybrid', cci: 'Dagger/Arcane', weights: { STR: 2, DEX: 4, VIT: 4, NTL: 16, WIS: 12 }},
    },
    MONSTERS: {
        mountain: [ { id: 'm_goblin', name: 'Mountain Goblin', baseHp: 25, baseAttack: 10, baseAC: 13, baseXP: 15, baseGold: 3}, { id: 'm_troll', name: 'Rock Troll', baseHp: 54, baseAttack: 18, baseAC: 23, baseXP: 35, baseGold: 7 }, ],
        forest: [ { id: 'f_spider', name: 'Forest Spider', baseHp: 30, baseAttack: 12, baseAC: 15, baseXP: 20, baseGold: 4 }, { id: 'f_wolf', name: 'Dire Wolf', baseHp: 60, baseAttack: 20, baseAC: 25, baseXP: 40, baseGold: 8 }, ],
        wastes: [ { id: 'w_scorpion', name: 'Giant Scorpion', baseHp: 40, baseAttack: 15, baseAC: 18, baseXP: 25, baseGold: 5 } ],
    },
    ITEMS: {
        baseItemTemplates: [
            { id: 'base_helm_1', name: 'Helmet', type: 'Armor', subType: 'Helmet', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1396.png', sockets: 2},
            { id: 'base_armor_1', name: 'Armor', type: 'Armor', subType: 'Armor', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/juugboytv-equipment1/IMG_1401.png', sockets: 2},
            { id: 'base_gauntlets_1', name: 'Gauntlets', type: 'Armor', subType: 'Gauntlets', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/main/IMG_1402.png', sockets: 2},
            { id: 'base_sword_1', name: 'Sword', type: 'Weapons', subType: 'Sword', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1412.png', sockets: 2 },
            { id: 'base_axe_1', name: 'Axe', type: 'Weapons', subType: 'Axe', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1413.png', sockets: 2 },
            { id: 'base_staff_1', name: 'Staff', type: 'Weapons', subType: 'Staff', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Weapons/IMG_1416.png', sockets: 2 },
            { id: 'base_firespell_1', name: 'FireSpell', type: 'Spells', subType: 'Fire', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Spells/IMG_1422.png', sockets: 2 },
            { id: 'base_airspell_1', name: 'AirSpell', type: 'Spells', subType: 'Air', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Spells/IMG_1423.png', sockets: 2 },
            { id: 'base_deathspell_1', name: 'Death', type: 'Spells', subType: 'Death Drain', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Spells/IMG_1425.png', sockets: 2 },
        ]
    },
    GEMS: {
        warstone: { name: 'WarStone', type: 'Fighter', abbreviation: 'WST', color: 'var(--glow-fighter)', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1503.png', stats: 'Adds +10 Attack' },
        mightstone: { name: 'MightStone', type: 'Fighter', abbreviation: 'MGS', color: 'var(--glow-fighter)', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gems/IMG_1517.png', stats: 'Adds +5 Strength' },
        obsidian_heart: { name: 'ObsidianHeart', type: 'Misc', abbreviation: 'OH', color: 'var(--glow-misc)', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1540.png', stats: '+15% Vitality' },
        ascend_core: { name: 'AcendCore', type: 'Misc', abbreviation: 'ASC', color: 'var(--glow-misc)', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/refs/heads/Gemsmisc/IMG_1528.png', stats: '+5% XP Gain' },
        air_totem: { name: 'AirTotem', type: 'Caster', abbreviation: 'AIR', color: 'var(--glow-caster)', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Gems/IMG_1512.png', stats: '+10 Air Damage' },
        death_shard: { name: 'DeathShard', type: 'Caster', abbreviation: 'DTH', color: 'var(--glow-caster)', imageUrl: 'https://raw.githubusercontent.com/juugboytv/Geminus/Gems/IMG_1515.png', stats: '+10% Lifesteal' },
    },
    gemCategories: {
        'Fighter': { ids: ['warstone', 'mightstone'] },
        'Utility': { ids: ['obsidian_heart'] },
        'Farming': { ids: ['ascend_core'] },
    },
    GemGradeUnlockLevels: [1, 100, 253, 1000, 6143, 13636, 35452, 83333, 172222],
    equipmentSlotConfig: [
        { name: 'Helmet', type: 'Helmet' }, { name: 'Weapon 1', type: 'Weapon' },
        { name: 'Armor', type: 'Armor' }, { name: 'Weapon 2', type: 'Weapon' },
        { name: 'Gauntlets', type: 'Gauntlets' }, { name: 'Leggings', type: 'Leggings' },
        { name: 'Boots', type: 'Boots' }, { name: 'Amulet', type: 'Amulet' },
        { name: 'Spell 1', type: 'Spellbook' }, { name: 'Ring', type: 'Ring' },
        { name: 'Spell 2', type: 'Spellbook' }
    ],
};

// --- UI Elements
const ui = {};
document.querySelectorAll('[id]').forEach(el => {
    const camelCaseId = el.id.replace(/-(\w)/g, (m, g) => g.toUpperCase());
    ui[camelCaseId] = el;
});

// --- Utility Functions
function showToast(message, isError = false) {
    ui.toastNotification.textContent = message;
    ui.toastNotification.className = `glass-panel fixed left-1/2 -translate-x-1/2 z-[210] transition-all duration-500 ease-in-out px-6 py-3 rounded-lg font-semibold ${isError ? 'toast-error' : 'toast-success'}`;
    ui.toastNotification.style.bottom = '5rem';
    setTimeout(() => { ui.toastNotification.style.bottom = '-100px'; }, 3000);
}

// --- Smoke Canvas Animation ---
const smokeCanvas = document.getElementById('smoke-canvas');
const smokeCtx = smokeCanvas.getContext('2d');
smokeCanvas.width = window.innerWidth;
smokeCanvas.height = window.innerHeight;

let smokeParticles = [];
const smokeParticleCount = 75;

class SmokeParticle {
    constructor(color) {
        this.x = Math.random() * smokeCanvas.width;
        this.y = Math.random() * smokeCanvas.height;
        this.size = Math.random() * 150 + 50;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -this.size) this.x = smokeCanvas.width + this.size;
        if (this.x > smokeCanvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = smokeCanvas.height + this.size;
        if (this.y > smokeCanvas.height + this.size) this.y = -this.size;
    }
    draw() {
        smokeCtx.fillStyle = this.color;
        smokeCtx.beginPath();
        smokeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        smokeCtx.filter = 'blur(60px)';
        smokeCtx.fill();
    }
}

function initSmokeParticles(theme) {
    smokeParticles = [];
    const color = theme === 'molten-core'
        ? `rgba(249, 115, 22, ${Math.random() * 0.07})`
        : `rgba(34, 211, 238, ${Math.random() * 0.07})`;

    for (let i = 0; i < smokeParticleCount; i++) {
        smokeParticles.push(new SmokeParticle(color));
    }
}

function updateSmokeParticleColors(theme) {
    const color = theme === 'molten-core'
        ? `rgba(249, 115, 22, ${Math.random() * 0.07})`
        : `rgba(34, 211, 238, ${Math.random() * 0.07})`;
    smokeParticles.forEach(p => {
        p.color = color;
    });
}

function animateSmoke() {
    smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
    for (let i = 0; i < smokeParticles.length; i++) {
        smokeParticles[i].update();
        smokeParticles[i].draw();
    }
    requestAnimationFrame(animateSmoke);
}

window.addEventListener('resize', () => {
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;
    const currentTheme = localStorage.getItem('geminusTheme') || 'aetherial-shard';
    initSmokeParticles(currentTheme);
    if(WorldMapManager.isInitialized) {
        WorldMapManager.isInitialized = false; // Force re-init to handle canvas resize
        WorldMapManager.init();
    }
});

animateSmoke();

// --- Manager Implementations ---
const SettingsManager = {
    isInitialized: false,
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        this.render();
        this.addEventListeners();
        this.updateButtonStates();
    },
    render() {
        const settingsContainer = ui.tabContentSettings;
        settingsContainer.innerHTML = `
        <div class="space-y-4">
            <div class="stat-accordion-item open">
                <button class="stat-accordion-header">
                    <h3 class="text-glow-subtle font-orbitron">UI Theme</h3>
                    <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div class="stat-accordion-content">
                    <p class="text-sm text-gray-400 mb-4">Select a visual theme for the game interface.</p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="theme-select-btn glass-button w-full py-3 rounded-md" data-theme="aetherial-shard">Aetherial Shard</button>
                        <button class="theme-select-btn glass-button w-full py-3 rounded-md" data-theme="molten-core">Molten Core</button>
                    </div>
                </div>
            </div>
        </div>`;
    },
    addEventListeners() {
        const settingsContainer = ui.tabContentSettings;
        settingsContainer.addEventListener('click', e => {
            const themeBtn = e.target.closest('.theme-select-btn');
            if (themeBtn) {
                this.setTheme(themeBtn.dataset.theme);
            }
        });
    },
    setTheme(themeName) {
        document.body.className = `theme-${themeName}`;
        localStorage.setItem('geminusTheme', themeName);
        this.updateButtonStates();
        updateSmokeParticleColors(themeName);
    },
    loadTheme() {
        const savedTheme = localStorage.getItem('geminusTheme') || 'aetherial-shard';
        this.setTheme(savedTheme);
        initSmokeParticles(savedTheme);
    },
    updateButtonStates() {
        const currentTheme = localStorage.getItem('geminusTheme') || 'aetherial-shard';
        document.querySelectorAll('.theme-select-btn').forEach(btn => {
            if (btn.dataset.theme === currentTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
};

// --- World Map Manager (Square Grid) ---
const WorldMapManager = {
    isInitialized: false,
    grid: [], // Stores the map data as a 2D array
    tileSize: 0,
    ctx: null,
    GRID_SIZE: 7, // Defines a 7x7 grid

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        const container = ui.miniMapContainer;
        const canvas = ui.miniMapCanvas;
        if (!container || !canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = container.clientWidth * dpr;
        canvas.height = container.clientHeight * dpr;
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientHeight}px`;

        this.ctx = canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);

        if (this.grid.length === 0) {
            this.generateGrid();
        }
        this.updateInteractButton();
        this.draw();
    },

    generateGrid() {
        this.grid = [];
        for (let y = 0; y < this.GRID_SIZE; y++) {
            const row = [];
            for (let x = 0; x < this.GRID_SIZE; x++) {
                // Default tile
                row.push({ feature: { name: 'Monster Zone', icon: '', color: 'rgba(50, 50, 50, 0.5)' } });
            }
            this.grid.push(row);
        }
        // Define special locations with custom colors
        this.grid[3][3].feature = { name: 'Start', icon: '🏠', color: 'rgba(50, 50, 50, 0.5)' };
        this.grid[2][4].feature = { name: 'Weapons/Combat Shop', icon: '⚔️', color: 'rgba(50, 50, 50, 0.5)' };
        this.grid[4][2].feature = { name: 'Magic/Accessories Shop', icon: '🔮', color: 'rgba(50, 50, 50, 0.5)' };
        this.grid[3][5].feature = { name: 'Bank', icon: '🏧', color: 'rgba(50, 50, 50, 0.5)' };
        this.grid[3][1].feature = { name: 'Sanctuary', icon: '🆘', color: 'rgba(50, 50, 50, 0.5)' };
        this.grid[5][3].feature = { name: 'Teleport Zone', icon: '🌀', color: 'rgba(50, 50, 50, 0.5)' };
    },

    movePlayer(dx, dy) {
        if (!state.player) return;
        const newX = state.player.pos.x + dx;
        const newY = state.player.pos.y + dy;

        // Edge Detection
        if (newY >= 0 && newY < this.GRID_SIZE && newX >= 0 && newX < this.GRID_SIZE) {
            state.player.pos.x = newX;
            state.player.pos.y = newY;
            this.draw();
            this.updateInteractButton();
            UIManager.updatePlayerStatusUI();
        }
    },

    updateInteractButton() {
        if (!state.player) return;
        const currentTile = this.grid[state.player.pos.y][state.player.pos.x];
        const interactKey = document.getElementById('key-interact');
        if (currentTile.feature && currentTile.feature.name !== 'Monster Zone' && currentTile.feature.name !== 'Start') {
            interactKey.textContent = `Enter`;
            interactKey.style.fontSize = '16px';
        } else {
            interactKey.textContent = 'Interact';
            interactKey.style.fontSize = '18px';
        }
    },

    handleInteraction() {
        if (!state.player) return;
        const currentTile = this.grid[state.player.pos.y][state.player.pos.x];
        if (currentTile && currentTile.feature && currentTile.feature.name !== 'Monster Zone') {
            console.log(`Interacting with: ${currentTile.feature.name}`);
            showToast(`You are at the ${currentTile.feature.name}.`);
        } else {
            showToast(`Nothing to interact with here.`);
        }
    },

    draw() {
        if (!this.ctx || !state.player) return;
        const container = ui.miniMapContainer;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

        // Create a Circular Clipping Mask
        ctx.save();
        ctx.beginPath();
        ctx.arc(container.clientWidth / 2, container.clientHeight / 2, container.clientWidth / 2, 0, Math.PI * 2);
        ctx.clip();

        const viewRadius = 2; // Zoomed in
        this.tileSize = container.clientWidth / (viewRadius * 2 + 1);

        const centerX = container.clientWidth / 2;
        const centerY = container.clientHeight / 2;

        for (let y = 0; y < this.GRID_SIZE; y++) {
            for (let x = 0; x < this.GRID_SIZE; x++) {
                const relX = x - state.player.pos.x;
                const relY = y - state.player.pos.y;

                const pixelX = centerX + relX * this.tileSize - this.tileSize / 2;
                const pixelY = centerY + relY * this.tileSize - this.tileSize / 2;

                this.drawSquare(pixelX, pixelY, this.tileSize, this.grid[y][x].feature);
            }
        }

        this.drawPlayer(centerX - this.tileSize / 2, centerY - this.tileSize / 2);

        // Restore the context to remove the clipping mask
        ctx.restore();
    },

    drawSquare(px, py, size, feature) {
        this.ctx.fillStyle = feature.color || 'rgba(10, 10, 10, 0.5)';
        this.ctx.fillRect(px, py, size, size);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px, py, size, size);

        if (feature && feature.icon) {
            this.ctx.font = `${size * 0.7}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillText(feature.icon, px + size / 2, py + size / 2);
        }
    },

    drawPlayer(px, py) {
        if (!state.player) return;
        this.ctx.font = `${this.tileSize * 0.7}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(state.player.icon, px + this.tileSize / 2, py + this.tileSize / 2);
    }
};

// --- D-Pad and Keyboard Controls ---
function initControls() {
    const keyElements = document.querySelectorAll('.game-key');

    const setKeyState = (key, isPressed) => {
        state.keyState[key] = isPressed;
        const keyElement = document.getElementById(`key-${key}`);
        if (keyElement) {
            keyElement.classList.toggle('pressed', isPressed);
        }
    };

    const handleKeyPress = (key) => {
        switch(key) {
            case 'up': WorldMapManager.movePlayer(0, -1); break;
            case 'down': WorldMapManager.movePlayer(0, 1); break;
            case 'left': WorldMapManager.movePlayer(-1, 0); break;
            case 'right': WorldMapManager.movePlayer(1, 0); break;
            case 'interact': WorldMapManager.handleInteraction(); break;
        }
    };

    // Touch controls
    keyElements.forEach(element => {
        const key = element.dataset.key;
        element.addEventListener('touchstart', (e) => { e.preventDefault(); setKeyState(key, true); handleKeyPress(key); });
        element.addEventListener('touchend', (e) => { e.preventDefault(); setKeyState(key, false); });
        element.addEventListener('mousedown', (e) => { e.preventDefault(); setKeyState(key, true); handleKeyPress(key); });
        element.addEventListener('mouseup', (e) => { e.preventDefault(); setKeyState(key, false); });
        element.addEventListener('mouseleave', () => { if (state.keyState[key]) setKeyState(key, false); });
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        let key;
        switch(e.key) {
            case 'ArrowUp': case 'w': key = 'up'; break;
            case 'ArrowDown': case 's': key = 'down'; break;
            case 'ArrowLeft': case 'a': key = 'left'; break;
            case 'ArrowRight': case 'd': key = 'right'; break;
            case 'Enter': case ' ': key = 'interact'; break;
            default: return;
        }
        e.preventDefault();
        if (!state.keyState[key]) { // Prevent rapid repeat on keydown
            setKeyState(key, true);
            handleKeyPress(key);
        }
    });

    window.addEventListener('keyup', (e) => {
        let key;
        switch(e.key) {
            case 'ArrowUp': case 'w': key = 'up'; break;
            case 'ArrowDown': case 's': key = 'down'; break;
            case 'ArrowLeft': case 'a': key = 'left'; break;
            case 'ArrowRight': case 'd': key = 'right'; break;
            case 'Enter': case ' ': key = 'interact'; break;
            default: return;
        }
        e.preventDefault();
        setKeyState(key, false);
    });
}

const ModalManager = {
    show(title, contentHTML, options = {}) {
        const { widthClass = 'w-11/12 max-w-lg', onContentReady } = options;
        ui.modalContainer.innerHTML = `
        <div class="modal-backdrop">
            <div class="glass-panel p-4 rounded-lg flex flex-col ${widthClass}">
                <div class="flex-shrink-0 flex justify-between items-center mb-4">
                    <h3 class="font-orbitron text-xl capitalize text-glow-subtle">${title}</h3>
                    <button id="modal-close-btn" class="text-2xl leading-none transition-colors hover:text-[var(--highlight-color)]">&times;</button>
                </div>
                <div id="modal-content-body" class="flex-grow overflow-y-auto custom-scrollbar">${contentHTML}</div>
            </div>
        </div>`;
        ui.modalContainer.querySelector('#modal-close-btn').onclick = () => this.hide();
        if (onContentReady) {
            onContentReady(ui.modalContainer.querySelector('#modal-content-body'));
        }
    },
    hide() {
        ui.modalContainer.innerHTML = "";
    }
};

const CreationManager = {
    init() {
        const contentHTML = `
        <div class="creation-card w-full h-full flex flex-col">
            <div class="flex-shrink-0">
                <h1 class="text-3xl font-orbitron text-center mb-4 text-glow-label">Create Your Hero</h1>
                <div class="mb-4 px-4">
                    <input type="text" id="creation-player-name" placeholder="Enter Character Name" class="w-full text-lg editor-input">
                </div>
                <h2 class="text-xl font-orbitron text-center mb-4 text-glow-subtle">Choose Your Race</h2>
            </div>
            <div id="creation-race-grid" class="flex-grow overflow-y-auto custom-scrollbar grid grid-cols-2 md:grid-cols-4 gap-2 px-4">
                ${Object.keys(GDD.RACES).map(raceId => `
                    <div class="race-option p-3 text-center border border-transparent rounded-md cursor-pointer hover:bg-[rgba(var(--highlight-color-rgb),0.2)] font-orbitron text-glow-subtle" data-race="${raceId}">${GDD.RACES[raceId].name}</div>
                `).join("")}
            </div>
            <div class="flex-shrink-0 mt-4 px-4">
                <button id="finish-creation-btn" class="glass-button w-full py-3 font-bold rounded-md" disabled>Finish</button>
            </div>
        </div>`;
        ModalManager.show('Create Your Character', contentHTML, {
            widthClass: 'w-full max-w-3xl h-full sm:h-auto sm:max-h-[90vh]',
            onContentReady: (contentDiv) => {
                let selectedRace = null;
                const finishBtn = contentDiv.querySelector('#finish-creation-btn');
                const nameInput = contentDiv.querySelector('#creation-player-name');
                const checkCanFinish = () => {
                    const name = nameInput.value.trim();
                    finishBtn.disabled = !selectedRace || name.length < 3;
                };
                contentDiv.querySelectorAll('.race-option').forEach(option => {
                    option.addEventListener('click', () => {
                        selectedRace = option.dataset.race;
                        contentDiv.querySelectorAll('.race-option').forEach(el => el.style.backgroundColor = 'transparent');
                        option.style.backgroundColor = `rgba(var(--highlight-color-rgb), 0.3)`;
                        checkCanFinish();
                    });
                });
                nameInput.addEventListener('input', checkCanFinish);
                finishBtn.addEventListener('click', () => {
                    const playerName = nameInput.value.trim();
                    this.finishCreation(playerName, selectedRace);
                });
            },
        });
    },
    finishCreation(playerName, raceId) {
        if (!raceId || !playerName) return;
        const raceData = GDD.RACES[raceId];
        state.player = {
            name: playerName,
            level: 1, xp: 0, gold: 1000,
            xpToNextLevel: GDD.FORMULAS.XP_BASE,
            attributePoints: GDD.FORMULAS.AP_PER_LEVEL,
            race: raceData.name,
            archetype: raceData.archetype,
            cci: raceData.cci,
            baseStats: {...raceData.weights },
            stats: {},
            inventory: [],
            equipment: {},
            gems: [],
            lastItemDrop: null,
            lastGemDrop: null,
            defeatedBosses: [],
            pos: { x: 3, y: 3 },
            icon: '👤'
        };
        GDD.equipmentSlotConfig.forEach(slot => state.player.equipment[slot.name] = null);
        this.generateStartingGear();
        ProfileManager.calculateAllStats();
        state.player.hp = state.player.stats.maxHp;
        ModalManager.hide();
        GameManager.init();
    },
    generateStartingGear() {
        const itemTypes = ['Dropper', 'Shadow', 'Echo'];
        GDD.ITEMS.baseItemTemplates.forEach(baseItem => {
            for(let i = 1; i <= 5; i++) {
                const newItem = {
                    instanceId: `${baseItem.id}_${Date.now()}_${Math.random()}`,
                    baseItemId: baseItem.id,
                    tier: Math.ceil(Math.random()* 10),
                    type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
                    socketedGems: []
                };
                if (Math.random() > 0.7) {
                    newItem.socketedGems.push({ id: 'warstone', grade: 1 });
                }
                state.player.inventory.push(newItem);
            }
        });
        Object.keys(GDD.GEMS).forEach(gemId => {
            state.player.gems.push({ id: gemId, grade: Math.ceil(Math.random() * 3) });
        });
    }
};

const ProfileManager = {
    addXp(amount, xpBonus = 0) {
        if (!state.player) return;
        const finalXp = amount * (1 + xpBonus / 100);
        state.player.xp += finalXp;
        CombatManager.logToGame(`You gained <span class="log-xp">${Math.floor(finalXp)} XP</span>!`);
        while (state.player.xp >= state.player.xpToNextLevel) {
            this.levelUp();
        }
        this.updateAllProfileUI();
    },
    addGold(amount) {
        if (!state.player) return;
        state.player.gold += amount;
        CombatManager.logToGame(`You found <span class="log-gold">${Math.floor(amount)} Gold</span>!`);
        this.updateAllProfileUI();
    },
    levelUp() {
        state.player.xp -= state.player.xpToNextLevel;
        state.player.level++;
        state.player.xpToNextLevel = Math.floor(GDD.FORMULAS.XP_BASE * Math.pow(GDD.FORMULAS.XP_GROWTH_RATE, state.player.level));
        state.player.attributePoints += GDD.FORMULAS.AP_PER_LEVEL;
        showToast(`You have reached Level ${state.player.level}! You gained ${GDD.FORMULAS.AP_PER_LEVEL} Attribute Points.`);
        this.calculateAllStats();
        state.player.hp = state.player.stats.maxHp;
    },
    spendAttributePoint(clickedAttr) {
        const p = state.player;
        if (p.attributePoints < GDD.FORMULAS.AP_PER_LEVEL) {
            showToast(`You need ${GDD.FORMULAS.AP_PER_LEVEL} points to allocate.`, true);
            return;
        }
        const raceData = Object.values(GDD.RACES).find(r => r.name === p.race);
        const weights = raceData.weights;
        const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);
        const pointsPerWeight = GDD.FORMULAS.AP_PER_LEVEL / totalWeight;
        for (const stat in weights) {
            p.baseStats[stat] += weights[stat] * pointsPerWeight;
        }
        p.attributePoints -= GDD.FORMULAS.AP_PER_LEVEL;
        this.calculateAllStats();
        StatsManager.render();
        UIManager.flashStatUpdate(clickedAttr);
        showToast("Attributes increased!", false);
    },
    calculateAllStats() {
        if (!state.player || !state.player.baseStats) return;
        const p = state.player;
        const totalStats = {...p.baseStats, WC: 0, SC: 0, AC: 0, XP_BONUS: 0 };
        for (const slotName in p.equipment) {
            const instanceId = p.equipment[slotName];
            if (instanceId) {
                const item = p.inventory.find(i => i.instanceId === instanceId);
                const baseItem = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
                if (baseItem && baseItem.stats) {
                    for (const stat in baseItem.stats) {
                        totalStats[stat] = (totalStats[stat] || 0) + baseItem.stats[stat];
                    }
                }
                if (item.socketedGems) {
                    item.socketedGems.forEach(gemInfo => {
                        if (gemInfo) {
                            const gemData = GDD.GEMS[gemInfo.id];
                            const gradeIndex = gemInfo.grade - 1;
                            if (gemData && gemData.stat && gemData.values && gradeIndex < gemData.values.length) {
                                totalStats[gemData.stat] = (totalStats[gemData.stat] || 0) + gemData.values[gradeIndex];
                            }
                        }
                    });
                }
            }
        }
        p.stats = {}; // Reset calculated stats
        p.stats.maxHp = GDD.FORMULAS.HP_BASE + (totalStats.VIT * GDD.FORMULAS.HP_PER_VIT);
        const baseWc = 10, baseSc = 10, baseAc = 20;
        p.stats.finalWC = (baseWc + totalStats.WC) * (1 + (totalStats.DEX * GDD.FORMULAS.WC_DEX_SCALING));
        p.stats.finalSC = (baseSc + totalStats.SC) * (1 + (totalStats.WIS * GDD.FORMULAS.SC_WIS_SCALING));
        p.stats.finalAC = (baseAc + totalStats.AC) * (1 + (totalStats.VIT * GDD.FORMULAS.AC_VIT_SCALING));
        p.stats.xpBonus = totalStats.XP_BONUS;
        const hitStat = p.archetype === 'True Caster' ? totalStats.WIS : totalStats.DEX;
        const hitScaling = p.archetype === 'True Caster' ? GDD.FORMULAS.HIT_CHANCE_WIS_SCALING : GDD.FORMULAS.HIT_CHANCE_DEX_SCALING;
        p.stats.hitChance = GDD.FORMULAS.HIT_CHANCE_BASE + (hitStat * hitScaling);
        const critStat = p.archetype === 'True Caster' ? totalStats.WIS : totalStats.DEX;
        const critScaling = p.archetype === 'True Caster' ? GDD.FORMULAS.CRIT_CHANCE_WIS_SCALING : GDD.FORMULAS.CRIT_CHANCE_DEX_SCALING;
        p.stats.critChance = GDD.FORMULAS.CRIT_CHANCE_BASE + (critStat * critScaling);
        if (p.hp === undefined || p.hp > p.stats.maxHp) {
            p.hp = p.stats.maxHp;
        }
        this.updateAllProfileUI();
    },
    updateAllProfileUI() {
        UIManager.updatePlayerStatusUI();
        if (CombatManager.isInitialized) CombatManager.updateCombatInfoPanel();
        if (StatsManager.isInitialized) StatsManager.render();
    }
};

const ItemManager = {
    generateAndAwardLoot(tier) {
        if (!state.player) return;
        if (Math.random() < 0.1) {
            const newItem = { name: `T${tier} Shadow Item` };
            state.player.lastItemDrop = newItem.name;
            CombatManager.logToGame(`You found a <span class="log-loot-item">${newItem.name}</span>!`);
        }
        if (Math.random() < 0.2) {
            const newGem = { name: 'Random Gem' };
            state.player.lastGemDrop = newGem.name;
            CombatManager.logToGame(`You found a <span class="log-loot-gem">${newGem.name}</span>!`);
        }
    },
};

const CombatManager = {
    isInitialized: false,
    currentMonster: null,
    logMessages: [],
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        this.render();
        this.addEventListeners();
        this.updateCombatInfoPanel();
        // This will need to be adjusted if GDD.ZONES is not an array. Assuming it is for now.
        // If GDD.ZONES is an object, the logic will need to change.
        this.populateMonsterList(state.game.currentZoneTier); 
        this.logMessages = ['Select a monster to begin combat.'];
        this.renderLog();
    },
    logToGame(message) {
        this.logMessages.push(message);
        if (this.logMessages.length > 5) {
            this.logMessages.shift();
        }
        this.renderLog();
    },
    renderLog() {
        const logDisplay = document.querySelector('#tab-content-combat #combat-log-display');
        if (logDisplay) {
            logDisplay.innerHTML = this.logMessages.join('<br>');
        }
    },
    render() {
        ui.tabContentCombat.innerHTML = `
        <div class="space-y-4 flex flex-col h-full">
            <div id="combat-info-panel" class="w-full p-2 rounded-lg bg-black/20 border" style="border-color: var(--border-color-main)">
                <div id="combat-stats-container"></div>
            </div>
            <div class="combat-control-bar flex gap-2 p-2 bg-black/20 rounded-lg">
                <select id="monsterSelect" class="editor-input flex-grow"></select>
                <button class="glass-button px-4 py-2" id="fightBtn">FIGHT</button>
            </div>
            <div class="flex justify-center gap-2">
                <button class="glass-button py-2 rounded-md w-1/2" id="attackBtn" style="display: none;">ATTACK</button>
                <button class="glass-button py-2 rounded-md w-1/2" id="castBtn" style="display: none;">CAST</button>
                <button class="glass-button py-2 rounded-md w-1/2" id="spellstrikeBtn" style="display: none;">SPELLSTRIKE</button>
            </div>
            <div id="combat-log-display" class="flex-grow p-2 text-center text-sm"></div>
        </div>`;
    },
    addEventListeners() {
        const combatTab = ui.tabContentCombat;
        combatTab.querySelector('#monsterSelect').addEventListener('change', (e) => this.selectMonster(e.target.value));
        combatTab.querySelector('#fightBtn').addEventListener('click', () => this.fight());
        combatTab.querySelector('#attackBtn').addEventListener('click', () => this.performAction('attack'));
        combatTab.querySelector('#castBtn').addEventListener('click', () => this.performAction('cast'));
        combatTab.querySelector('#spellstrikeBtn').addEventListener('click', () => this.performAction('spellstrike'));
    },
    populateMonsterList(zoneTier) {
        state.game.currentZoneTier = zoneTier;
        // This part assumes GDD.ZONES is defined elsewhere, as it's missing from the provided GDD.
        // As a fallback, I'll use a hardcoded biome or the first available one.
        const biome = 'mountain'; // Fallback
        const monsterTemplates = GDD.MONSTERS[biome] || [];
        const monsterSelect = document.getElementById('monsterSelect');
        let optionsHTML = '<option value="">Select a monster...</option>';
        monsterTemplates.forEach(m => optionsHTML += `<option value="${m.id}">${m.name}</option>`);
        monsterSelect.innerHTML = optionsHTML;
        this.resetCombatSelection();
    },
    selectMonster(monsterId) {
        if (!monsterId) { this.resetCombatSelection(); return; }
        const biome = 'mountain'; // Fallback
        const monsterTemplate = GDD.MONSTERS[biome].find(m => m.id === monsterId);
        if (!monsterTemplate) return;
        this.currentMonster = {
            ...monsterTemplate,
            hp: monsterTemplate.baseHp,
            maxHp: monsterTemplate.baseHp,
        };
        this.logMessages = [`You are targeting ${this.currentMonster.name}.`];
        this.renderLog();
        this.updateButtons();
    },
    fight() {
        if (!this.currentMonster) {
            showToast("Please select a monster first.", true);
            return;
        }
        state.game.combatActive = true;
        this.currentMonster.hp = this.currentMonster.maxHp;
        this.logMessages = [`You engage the ${this.currentMonster.name}!`];
        this.renderLog();
        this.updateButtons();
    },
    performAction(actionType) {
        if (!state.game.combatActive || !this.currentMonster) return;
        const p = state.player;
        const enemy = this.currentMonster;
        // Player's turn
        if (Math.random() * 100 > p.stats.hitChance) {
            this.logToGame(`You <span class='log-system'>missed</span>!`);
        } else {
            let damage = 0;
            let damageSourceStat = 0;
            switch(p.archetype) {
                case 'True Fighter': damageSourceStat = p.stats.finalWC; break;
                case 'True Caster': damageSourceStat = p.stats.finalSC; break;
                case 'Hybrid': damageSourceStat = (p.stats.finalWC + p.stats.finalSC) * GDD.FORMULAS.HYBRID_MASTERY_EFFICIENCY; break;
            }
            damage = (GDD.FORMULAS.PLAYER_DAMAGE_CONSTANT * damageSourceStat) / enemy.baseAC;
            damage = Math.max(1, damage);
            let isCrit = Math.random() * 100 < p.stats.critChance;
            if (isCrit) {
                damage *= GDD.FORMULAS.CRIT_DAMAGE_MULTIPLIER;
                this.logToGame(`CRITICAL HIT! You strike ${enemy.name} for <span class="log-player">${damage.toFixed(0)}</span> damage.`);
            } else {
                this.logToGame(`You hit ${enemy.name} for <span class="log-player">${damage.toFixed(0)}</span> damage.`);
            }
            enemy.hp -= damage;
        }
        // Check for enemy defeat
        if (enemy.hp <= 0) {
            enemy.hp = 0;
            this.logToGame(`<span class="log-enemy">${enemy.name} is dead, R.I.P.</span>`);
            // The GDD doesn't specify gearTier, so using a fallback.
            const gearTier = 1; 
            ProfileManager.addXp(enemy.baseXP, p.stats.xpBonus);
            ProfileManager.addGold(enemy.baseGold);
            ItemManager.generateAndAwardLoot(gearTier);
            this.endCombat();
        } else {
            // Enemy's turn
            let enemyDamage = Math.max(1, enemy.baseAttack - (p.stats.finalAC * GDD.FORMULAS.MONSTER_DAMAGE_AC_REDUCTION_FACTOR));
            p.hp -= enemyDamage;
            this.logToGame(`${enemy.name} hits you for <span class="log-enemy">${enemyDamage.toFixed(0)}</span> damage.`);
        }
        if (p.hp <= 0) {
            p.hp = 0;
            this.logToGame("You have been defeated!");
            this.endCombat();
        }
        ProfileManager.updateAllProfileUI();
    },
    endCombat() {
        state.game.combatActive = false;
        this.updateButtons();
    },
    resetCombatSelection() {
        this.currentMonster = null;
        state.game.combatActive = false;
        this.logMessages = ['Select a monster to begin combat.'];
        this.renderLog();
        this.updateButtons();
    },
    updateCombatInfoPanel() {
        const p = state.player;
        if (!p || !p.stats) return;
        const hpPercent = (p.hp / p.stats.maxHp) * 100;
        let healthClass = hpPercent < 20 ? 'text-red-500' : hpPercent < 50 ? 'text-yellow-500' : 'text-green-500';

        const createStatHTML = (label, value) => `<span class="text-glow-label">${label}:</span><span class="text-glow-subtle">${value}</span>`;
        // Fallback for missing GDD.ZONES data
        const zoneName = state.zone.name || "Unknown Zone";
        document.getElementById('combat-stats-container').innerHTML = `
            ${createStatHTML('Level', p.level)}
            ${createStatHTML('Inv/Bags', `${p.inventory.length}/200`)}
            ${createStatHTML('Health', `<span class="${healthClass}">${Math.ceil(p.hp)} / ${Math.ceil(p.stats.maxHp)}</span>`)}
            ${createStatHTML('Gem Pouch', `${p.gems.length}/${InventoryManager.MAX_GEMS}`)}
            ${createStatHTML('Gold', Math.floor(p.gold).toLocaleString())}
            ${createStatHTML('Last Item', p.lastItemDrop || 'None')}
            ${createStatHTML('XP', Math.floor(p.xp).toLocaleString())}
            ${createStatHTML('Last Gem', p.lastGemDrop || 'None')}
            ${createStatHTML('Next Lvl', Math.floor(p.xpToNextLevel).toLocaleString())}
            <div class="col-span-4 text-glow-subtle text-center mt-1">Location: ${zoneName}</div>
        `;
    },
    updateButtons() {
        const fightBtn = document.getElementById('fightBtn');
        const attackBtn = document.getElementById('attackBtn');
        const castBtn = document.getElementById('castBtn');
        const spellstrikeBtn = document.getElementById('spellstrikeBtn');

        if(!fightBtn || !attackBtn || !castBtn || !spellstrikeBtn) return;

        fightBtn.disabled = !this.currentMonster || state.game.combatActive;
        const canAct = this.currentMonster && state.game.combatActive;
        attackBtn.style.display = (canAct && state.player.archetype === 'True Fighter') ? 'flex' : 'none';
        castBtn.style.display = (canAct && state.player.archetype === 'True Caster') ? 'flex' : 'none';
        spellstrikeBtn.style.display = (canAct && state.player.archetype === 'Hybrid') ? 'flex' : 'none';
    }
};

const StatsManager = {
    isInitialized: false,
    statMetadata: {
        STR: { name: 'Strength', icon: '💪', description: 'Increases physical damage from Fighter class weapons and contributes to carrying capacity.' },
        DEX: { name: 'Dexterity', icon: '🏹', description: 'Improves accuracy, critical hit chance, and effectiveness of finesse-based weapons.' },
        VIT: { name: 'Vitality', icon: '❤️', description: 'Increases maximum Health Points and improves resistance to physical damage.' },
        NTL: { name: 'Intelligence', icon: '🧠', description: 'Boosts magical damage from Caster class spellbooks and increases maximum Mana.' },
        WIS: { name: 'Wisdom', icon: '🔮', description: 'Enhances magical accuracy, critical spell chance, and resistance to magical effects.' },
        finalWC: { name: 'Weapon Class', icon: '⚔️', description: 'Your total effectiveness with physical weapons, calculated from Strength and equipped items.'},
        finalSC: { name: 'Spell Class', icon: '✨', description: 'Your total effectiveness with magic, calculated from Intelligence and equipped spellbooks.' },
        finalAC: { name: 'Armor Class', icon: '🛡️', description: 'Your total damage reduction, calculated from Vitality and equipped armor.' },
        maxHp: { name: 'Health Points', icon: '❤️', description: 'Your life force. If it reaches zero, you are defeated.' },
        hitChance: { name: 'Hit Chance', icon: '🎯', description: 'The probability of successfully landing an attack on an enemy.' },
        critChance: { name: 'Crit Chance', icon: '💥', description: 'The probability of an attack dealing bonus critical damage.' },
    },
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        this.render();
        this.addEventListeners();
    },
    render() {
        const statsContainer = ui.tabContentStats;
        if (!statsContainer || !state.player) return;
        const p = state.player;
        const canUpgrade = p.attributePoints >= GDD.FORMULAS.AP_PER_LEVEL;

        const createStatLine = (attrKey, value, isUpgradable = false) => {
            const meta = this.statMetadata[attrKey] || { name: attrKey, icon: '?', description: 'No info available.' };
            const upgradeButton = isUpgradable ? `<button class="attr-btn" data-attr="${attrKey}" ${!canUpgrade ? 'disabled' : ''}>+</button>` : '';
            const infoButton = `<button class="info-btn" data-title="${meta.name}" data-description="${meta.description}">i</button>`;
            return `
            <div class="stat-line">
                <span class="stat-icon">${meta.icon}</span>
                <span class="stat-name text-glow-subtle">${meta.name}</span>
                <span class="stat-value text-glow-subtle" data-stat-value="${attrKey}">${value}</span>
                ${upgradeButton}
                ${infoButton}
            </div>`;
        };

        const createHpLine = () => {
            const meta = this.statMetadata.maxHp;
            const hpPercent = (p.hp / p.stats.maxHp) * 100;
            return `
            <div class="stat-line">
                <span class="stat-icon">${meta.icon}</span>
                <span class="stat-name text-glow-subtle">${meta.name}</span>
                <div class="flex-grow flex items-center gap-2">
                    <div class="progress-bar-track h-3 flex-grow"><div class="progress-bar-fill h-full" style="width: ${hpPercent}%; background-color: var(--hp-color);"></div></div>
                    <span class="stat-value text-glow-subtle">${Math.ceil(p.hp)} / ${Math.ceil(p.stats.maxHp)}</span>
                </div>
                <button class="info-btn" data-title="${meta.name}" data-description="${meta.description}">i</button>
            </div>`;
        };

        statsContainer.innerHTML = `
        <div id="stats-container" class="space-y-3">
            <div class="stat-accordion-item open">
                <button class="stat-accordion-header">
                    <h3 class="text-glow-subtle font-orbitron">Secondary Attributes</h3>
                    <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div class="stat-accordion-content">
                    ${createStatLine('STR', Math.round(p.baseStats.STR), true)}
                    ${createStatLine('DEX', Math.round(p.baseStats.DEX), true)}
                    ${createStatLine('VIT', Math.round(p.baseStats.VIT), true)}
                    ${createStatLine('NTL', Math.round(p.baseStats.NTL), true)}
                    ${createStatLine('WIS', Math.round(p.baseStats.WIS), true)}
                    <div class="stat-line mt-2">
                        <span class="stat-icon">💎</span>
                        <span class="stat-name text-glow-subtle">Unspent Points</span>
                        <span id="unspent-points-value" class="stat-value text-glow-label">${p.attributePoints || 0}</span>
                    </div>
                </div>
            </div>
            <div class="stat-accordion-item">
                <button class="stat-accordion-header">
                    <h3 class="text-glow-subtle font-orbitron">Primary Combat Stats</h3>
                    <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div class="stat-accordion-content">
                    ${createStatLine('finalWC', p.stats.finalWC.toFixed(2))}
                    ${createStatLine('finalSC', p.stats.finalSC.toFixed(2))}
                    ${createStatLine('finalAC', p.stats.finalAC.toFixed(2))}
                </div>
            </div>
            <div class="stat-accordion-item">
                <button class="stat-accordion-header">
                    <h3 class="text-glow-subtle font-orbitron">Derived Stats</h3>
                    <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div class="stat-accordion-content">
                    ${createHpLine()}
                    ${createStatLine('hitChance', `${p.stats.hitChance.toFixed(2)}%`)}
                    ${createStatLine('critChance', `${p.stats.critChance.toFixed(2)}%`)}
                </div>
            </div>
        </div>`;
    },
    addEventListeners() {
        const statsContainer = ui.tabContentStats;
        statsContainer.addEventListener('click', (e) => {
            const header = e.target.closest('.stat-accordion-header');
            const attrBtn = e.target.closest('.attr-btn');
            const infoBtn = e.target.closest('.info-btn');
            if (header) {
                header.parentElement.classList.toggle('open');
            } else if (attrBtn) {
                ProfileManager.spendAttributePoint(attrBtn.dataset.attr);
            } else if (infoBtn) {
                this.showStatInfo(infoBtn.dataset.title, infoBtn.dataset.description);
            }
        });
        document.getElementById('stat-info-modal').addEventListener('click', () => this.hideStatInfo());
    },
    showStatInfo(title, description) {
        const modal = document.getElementById('stat-info-modal');
        modal.querySelector('#stat-info-title').textContent = title;
        modal.querySelector('#stat-info-description').textContent = description;
        modal.style.display = 'flex';
    },
    hideStatInfo() {
        document.getElementById('stat-info-modal').style.display = 'none';
    }
};

const InventoryManager = {
    isInitialized: false,
    MAX_GEMS: 200,
    filterState: { category: 'All', subType: 'All', tier: 'All', quality: 'All', sortBy: 'tier', order: 'desc' },
    inventoryBags: {
        'Weapon Chest': ['Weapons'],
        'Bag of Gear': ['Armor'],
        'Jewelry Box': ['Amulet', 'Ring'],
        'Spell Satchel': ['Spells'],
    },
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        this.renderInventoryTab();
        this.addEventListeners();
        this.populateFilterOptions();
        this.updateAllViews();
    },
    renderInventoryTab() {
        const inventoryContainer = ui.tabContentInventory;
        let bagsHTML = "";
        for (const bagName in this.inventoryBags) {
            bagsHTML += `
            <div class="stat-accordion-item open" data-bag-container="${bagName}">
                <button class="stat-accordion-header">
                    <h3 class="text-glow-subtle font-orbitron">${bagName} <span id="inventory-${bagName.replace(/\s+/g, '-')}-count" class="text-xs text-gray-400 font-sans"></span></h3>
                    <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div class="stat-accordion-content !p-2">
                    <div class="inventory-grid" data-bag-name="${bagName}"></div>
                </div>
            </div>`;
        }
        inventoryContainer.innerHTML = `
        <div id="inventory-sort-container" class="mb-2">
            <div class="stat-accordion-item open">
                <button class="stat-accordion-header">
                    <h3 class="text-glow-subtle font-orbitron"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h9m-9 4h6"></path></svg>Sort & Filter</h3>
                    <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div class="stat-accordion-content !p-2">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div><label class="text-xs text-gray-400">Category</label><select id="inventory-filter-category-select" class="editor-input !w-full !text-xs"></select></div>
                        <div><label class="text-xs text-gray-400">Sub-Type</label><select id="inventory-filter-subtype-select" class="editor-input !w-full !text-xs"></select></div>
                        <div><label class="text-xs text-gray-400">Tier</label><select id="inventory-filter-tier-select" class="editor-input !w-full !text-xs"></select></div>
                        <div><label class="text-xs text-gray-400">Quality</label><select id="inventory-filter-quality-select" class="editor-input !w-full !text-xs"></select></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mt-2 border-t border-gray-700 pt-2">
                        <div><label class="text-xs text-gray-400">Sort By</label><select id="inventory-sort-by-select" class="editor-input !w-full !text-xs"><option value="tier">Tier</option><option value="name">Name</option><option value="type">Type</option></select></div>
                        <div><label class="text-xs text-gray-400">Order</label><select id="inventory-sort-order-select" class="editor-input !w-full !text-xs"><option value="desc">Descending</option><option value="asc">Ascending</option></select></div>
                    </div>
                </div>
            </div>
        </div>
        ${bagsHTML}
        <div class="stat-accordion-item open">
            <button class="stat-accordion-header">
                <h3 class="text-glow-subtle font-orbitron">Gem Pouch <span id="inventory-gem-pouch-count" class="text-xs text-gray-400 font-sans"></span></h3>
                <svg class="accordion-arrow w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div class="stat-accordion-content !p-2">
                <div class="gem-pouch-grid"></div>
            </div>
        </div>`;
    },
    addEventListeners() {
        const inventoryContainer = ui.tabContentInventory;
        inventoryContainer.addEventListener('click', e => {
            const slot = e.target.closest('.inventory-slot');
            const gemItem = e.target.closest('.gem-item');
            const header = e.target.closest('.stat-accordion-header');
            if (slot?.dataset.instanceId) this.showItemActionModal(slot.dataset.instanceId, null);
            else if (gemItem?.dataset.gemId) this.showItemActionModal(null, gemItem.dataset.gemId);
            else if (header) header.parentElement.classList.toggle('open');
        });
        inventoryContainer.addEventListener('change', e => {
            const targetId = e.target.id;
            if (targetId.startsWith('inventory-filter-') || targetId.startsWith('inventory-sort-')) {
                this.filterState.category = document.getElementById('inventory-filter-category-select').value;
                this.filterState.subType = document.getElementById('inventory-filter-subtype-select').value;
                this.filterState.tier = document.getElementById('inventory-filter-tier-select').value;
                this.filterState.quality = document.getElementById('inventory-filter-quality-select').value;
                this.filterState.sortBy = document.getElementById('inventory-sort-by-select').value;
                this.filterState.order = document.getElementById('inventory-sort-order-select').value;
                if (targetId === 'inventory-filter-category-select') {
                    this.populateSubTypeFilter();
                    this.filterState.subType = 'All';
                    document.getElementById('inventory-filter-subtype-select').value = 'All';
                }
                this.renderInventoryBags();
            }
        });
        document.getElementById('item-action-modal-backdrop').addEventListener('click', () => this.hideItemActionModal());
    },
    populateFilterOptions() {
        document.getElementById('inventory-filter-category-select').innerHTML = ['All', ...Object.keys(this.inventoryBags)].map(c => `<option value="${c}">${c}</option>`).join("");
        document.getElementById('inventory-filter-tier-select').innerHTML = '<option value="All">All Tiers</option>' + Array.from({length: 20}, (_, i) => `<option value="${i+1}">Tier ${i+1}</option>`).join("");
        document.getElementById('inventory-filter-quality-select').innerHTML = ['All', 'Dropper', 'Shadow', 'Echo'].map(q => `<option value="${q}">${q}</option>`).join("");
        this.populateSubTypeFilter();
    },
    populateSubTypeFilter() {
        const category = document.getElementById('inventory-filter-category-select').value;
        const subTypeSelect = document.getElementById('inventory-filter-subtype-select');
        let subTypes = new Set();
        const itemsToScan = GDD.ITEMS.baseItemTemplates.filter(item => {
            if (category === 'All') return true;
            return this.inventoryBags[category]?.includes(item.type);
        });
        itemsToScan.forEach(item => subTypes.add(item.subType || item.type));
        subTypeSelect.innerHTML = ['All', ...Array.from(subTypes).sort()].map(s => `<option value="${s}">${s}</option>`).join("");
    },
    renderInventoryBags() {
        const equippedIds = Object.values(state.player.equipment).filter(Boolean);
        let unequippedItems = state.player.inventory.filter(item => !equippedIds.includes(item.instanceId));
        const { category, subType, tier, quality} = this.filterState;
        const filteredItems = unequippedItems.filter(item => {
            const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            if (!base) return false;
            if (category !== 'All' && !this.inventoryBags[category]?.includes(base.type)) return false;
            if (subType !== 'All' && (base.subType || base.type) !== subType) return false;
            if (tier !== 'All' && item.tier.toString() !== tier) return false;
            if (quality !== 'All' && item.type !== quality) return false;
            return true;
        });
        filteredItems.sort((a, b) => {
            const baseA = GDD.ITEMS.baseItemTemplates.find(item => item.id === a.baseItemId);
            const baseB = GDD.ITEMS.baseItemTemplates.find(item => item.id === b.baseItemId);
            let compareA = (this.filterState.sortBy === 'name') ? baseA.name : (this.filterState.sortBy === 'type' ? baseA.type : a.tier);
            let compareB = (this.filterState.sortBy === 'name') ? baseB.name : (this.filterState.sortBy === 'type' ? baseB.type : b.tier);
            if (compareA < compareB) return this.filterState.order === 'asc' ? -1 : 1;
            if (compareA > compareB) return this.filterState.order === 'asc' ? 1 : -1;
            return 0;
        });
        document.querySelectorAll('#tab-content-inventory .inventory-grid').forEach(grid => grid.innerHTML = "");
        filteredItems.forEach(item => {
            const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            for (const bagName in this.inventoryBags) {
                if (this.inventoryBags[bagName].includes(base.type)) {
                    const grid = document.querySelector(`#tab-content-inventory .inventory-grid[data-bag-name="${bagName}"]`);
                    if (grid) {
                        let overlaysHTML = this.generateGemOverlaysHTML(item);
                        grid.innerHTML += `
                        <div class="inventory-slot" data-instance-id="${item.instanceId}">
                            ${overlaysHTML}
                            <img src="${base.imageUrl}" onerror="this.onerror=null;this.src='https://placehold.co/60x60/1f2937/ffffff?text=ERR';">
                            <span class="item-tier-label">T${item.tier}</span>
                        </div>`;
                    }
                    break;
                }
            }
        });
        this.updateCounts();
    },
    updateAllViews() {
        this.renderInventoryBags();
        this.renderGemPouch();
        this.updateCounts();
    },
    updateCounts() {
        const equippedIds = Object.values(state.player.equipment).filter(Boolean);
        const unequippedItems = state.player.inventory.filter(item => !equippedIds.includes(item.instanceId));
        for (const bagName in this.inventoryBags) {
            const count = unequippedItems.filter(item => {
                const baseItem = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
                return baseItem && this.inventoryBags[bagName].includes(baseItem.type);
            }).length;
            document.getElementById(`inventory-${bagName.replace(/\s+/g, '-')}-count`).textContent = `(${count})`;
        }
        document.getElementById('inventory-gem-pouch-count').textContent = `(${state.player.gems.length}/${this.MAX_GEMS})`;
    },
    renderGemPouch() {
        const grid = document.querySelector('#tab-content-inventory .gem-pouch-grid');
        if (!grid) return;
        grid.innerHTML = state.player.gems.map(gemInfo => {
            const gem = GDD.GEMS[gemInfo.id];
            return `
            <div class="gem-item" data-gem-id="${gemInfo.id}"><img src="${gem.imageUrl}" class="w-10 h-10" onerror="this.onerror=null;this.src='https://placehold.co/40x40/1f2937/ffffff?text=ERR';"><span class="item-label text-glow-subtle">${gem.abbreviation}${gemInfo.grade}</span></div>`;
        }).join("");
    },
    showItemActionModal(instanceId, gemId) {
        const modalBody = document.getElementById('item-action-modal-body');
        let contentHTML = "", actionButtonHTML = "", actionHandler = null;
        if (instanceId) {
            const item = state.player.inventory.find(i => i.instanceId === instanceId);
            if (!item) return;
            const baseItem = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            const isEquipped = Object.values(state.player.equipment).includes(instanceId);
            let gemListHTML = item.socketedGems?.filter(g => g).length > 0 ? `<div class="item-gem-list">${item.socketedGems.map(gemInfo => {
                if (!gemInfo) return "";
                const gemData = GDD.GEMS[gemInfo.id];
                return `<div class="item-gem-entry"><span class="item-gem-name">${gemData.abbreviation}${gemInfo.grade}</span><span class="item-gem-effect">${this.getGemEffectValueText(gemInfo, gemData)}</span></div>`;
            }).join("")}</div>` : "";
            contentHTML = `<div class="item-name text-glow-subtle">${baseItem.name}</div><div class="item-type">Tier ${item.tier} ${baseItem.type}</div>${gemListHTML}`;
            actionButtonHTML = `<button id="item-action-button" class="glass-button w-full py-2 rounded-md mt-4">${isEquipped ? 'Unequip' : 'Equip'}</button>`;
            actionHandler = () => isEquipped ? this.unequipItem(instanceId) : this.equipItem(instanceId);
        } else if (gemId) {
            const gemInfo = state.player.gems.find(g => g.id === gemId);
            if (!gemInfo) return;
            const gemData = GDD.GEMS[gemId];
            contentHTML = `<div class="item-name text-glow-subtle">${gemData.name}</div><div class="item-type">Grade ${gemInfo.grade} Gem</div><div class="item-stat"><span class="item-stat-label">${gemData.effect}: </span><span class="item-stat-value text-glow-label">${this.getGemEffectValueText(gemInfo, gemData)}</span></div>`;
        }
        modalBody.innerHTML = contentHTML + actionButtonHTML;
        document.getElementById('item-action-modal-content').style.display = 'block';
        document.getElementById('item-action-modal-backdrop').style.display = 'block';
        const actionButton = document.getElementById('item-action-button');
        if (actionButton && actionHandler) actionButton.addEventListener('click', actionHandler, { once: true });
    },
    getGemEffectValueText(gemInfo, gemData) {
        let effectiveGrade = Array.from({length: GDD.GemGradeUnlockLevels.length}, (_, i) => state.player.level >= GDD.GemGradeUnlockLevels[i] ? i + 1 : 0).filter(Boolean).pop() || 1;
        const gradeIndex = Math.min(gemInfo.grade, effectiveGrade) - 1;
        if (gradeIndex < 0 || !gemData.values) return 'N/A';
        return `+${Array.isArray(gemData.values) ? gemData.values[gradeIndex] : gemData.values.sc?.[gradeIndex] || gemData.values.wc?.[gradeIndex]}%`;
    },
    hideItemActionModal() {
        document.getElementById('item-action-modal-content').style.display = 'none';
        document.getElementById('item-action-modal-backdrop').style.display = 'none';
    },
    equipItem(instanceId) {
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const baseItem = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
        const slotType = baseItem.type;
        let targetSlotName = GDD.equipmentSlotConfig.find(slot => slot.type === slotType && !state.player.equipment[slot.name])?.name;
        if (!targetSlotName) {
            targetSlotName = GDD.equipmentSlotConfig.find(slot => slot.type === slotType)?.name;
        }
        if (!targetSlotName) {
            showToast(`No available slot for ${slotType}.`, true);
            return;
        }
        if (state.player.equipment[targetSlotName]) {
            this.unequipItem(state.player.equipment[targetSlotName], false);
        }
        state.player.equipment[targetSlotName] = instanceId;
        this.hideItemActionModal();
        this.updateAllViews();
        if (EquipmentManager.isInitialized) EquipmentManager.renderEquipmentView();
        ProfileManager.calculateAllStats();
        showToast(`${baseItem.name} equipped.`, false);
    },
    unequipItem(instanceId, showModalUpdate = true) {
        const slotName = Object.keys(state.player.equipment).find(key => state.player.equipment[key] === instanceId);
        if (!slotName) return;
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const baseItem = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
        state.player.equipment[slotName] = null;
        this.hideItemActionModal();
        if (showModalUpdate) {
            this.updateAllViews();
            if (EquipmentManager.isInitialized) EquipmentManager.renderEquipmentView();
        }
        ProfileManager.calculateAllStats();
        showToast(`${baseItem.name} unequipped.`, false);
    },
    generateGemOverlaysHTML(item) {
        let overlaysHTML = '';
        if (item.socketedGems && item.socketedGems.length > 0) {
            overlaysHTML += '<div class="gem-overlays-container">';
            const gem1 = item.socketedGems[0];
            const gem2 = item.socketedGems[1];

            if (gem1) {
                const gemData1 = GDD.GEMS[gem1.id];
                overlaysHTML += `<div class="gem-overlay fighter">${gemData1.abbreviation}${gem1.grade}</div>`;
            }

            if (!gem1 && gem2) {
                overlaysHTML += '<div></div>';
            }

            if (gem2) {
                const gemData2 = GDD.GEMS[gem2.id];
                overlaysHTML += `<div class="gem-overlay caster">${gemData2.abbreviation}${gem2.grade}</div>`;
            }
            overlaysHTML += '</div>';
        }
        return overlaysHTML;
    }
};

const EquipmentManager = {
    isInitialized: false,
    init() {
        if(this.isInitialized) return;
        this.isInitialized = true;
        this.renderEquipmentView();
        this.addEventListeners();
    },
    renderEquipmentView() {
        const equipmentContainer = ui.tabContentEquipment;
        if (!equipmentContainer) return;
        const slotsHTML = GDD.equipmentSlotConfig.map(slot => {
            const instanceId = state.player.equipment[slot.name];
            const item = state.player.inventory.find(i => i.instanceId === instanceId);
            let contentHTML = '<span class="text-xs text-gray-500">Empty</span>';
            if (item) {
                const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
                let overlaysHTML = InventoryManager.generateGemOverlaysHTML(item);
                contentHTML = `
                ${overlaysHTML}
                <img src="${base.imageUrl}" class="h-12 w-12 object-contain" onerror="this.onerror=null;this.src='https://placehold.co/48x48/1f2937/ffffff?text=ERR';">
                <span class="item-tier-label">T${item.tier}</span>`;
            }
            return`
            <div class="equipment-slot-wrapper">
                <div class="equipment-slot-title font-orbitron text-glow-subtle"><span>${slot.name}</span></div>
                <div class="equipment-slot-content" data-slot-name="${slot.name}" data-instance-id="${instanceId || ""}">${contentHTML}</div>
            </div>`;
        }).join("");
        equipmentContainer.innerHTML = `<div class="equipment-grid">${slotsHTML}</div>`;
    },
    addEventListeners() {
        const equipmentContainer = ui.tabContentEquipment;
        equipmentContainer.addEventListener('click', e => {
            const slot = e.target.closest('.equipment-slot-content');
            if (slot && slot.dataset.instanceId) {
                InventoryManager.showItemActionModal(slot.dataset.instanceId, null);
            }
        });
    },
};

const InfusionManager = {
    init() {
        // Since the content is dynamically added, we ensure it exists before proceeding.
        const infusionContent = `
        <div id="infusion-container">
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-xl font-orbitron text-glow-label">Infusion</h2>
                <button id="info-button" class="filter-btn">Info/how to 🙋‍♂️🙋‍♀️</button>
            </div>
            <div class="glass-panel rounded-lg p-1 sm:p-2">
                <div class="tab-bar">
                    <button class="tab-button primary-tab-button active" data-tab="socket"><i class="gg-plug"></i> Socket</button>
                    <button class="tab-button primary-tab-button" data-tab="unsocket"><i class="gg-unplug"></i> Unsocket</button>
                </div>
                <div class="p-2 sm:p-4">
                    <div id="infusion-socket-panel" class="tab-panel primary-panel active">
                        <div class="tab-bar mb-4">
                            <button class="tab-button secondary-tab-button active" data-view="visual">Visual View</button>
                            <button class="tab-button secondary-tab-button" data-view="text">Text View</button>
                        </div>
                        <div id="socket-visual-view" class="tab-panel secondary-panel active">
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 class="text-lg font-orbitron mb-3 text-glow-label"><i class="gg-box mr-2"></i>Gems</h3>
                                    <div class="pouch-background">
                                        <div id="gem-type-filter-bar" class="filter-group mb-3"></div>
                                        <div id="gem-grade-filter-bar" class="filter-group mb-3"></div>
                                        <div id="infusion-gem-pouch-grid" class="gem-pouch-grid"></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-lg font-orbitron mb-3 text-glow-label"><i class="gg-anvil mr-2"></i>Items</h3>
                                    <div class="pouch-background">
                                        <div id="item-filter-bar-socket" class="flex flex-col gap-3"></div>
                                        <div id="item-inventory-grid-socket" class="inventory-grid mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="socket-text-view" class="tab-panel secondary-panel">
                            <div class="pouch-background space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div class="md:col-span-1">
                                        <label for="text-item-select" class="text-sm text-gray-400">Items</label>
                                        <select id="text-item-select" class="editor-input"></select>
                                    </div>
                                    <div class="md:col-span-1">
                                        <label for="text-gem-select" class="text-sm text-gray-400">Gems</label>
                                        <select id="text-gem-select" class="editor-input"></select>
                                    </div>
                                    <button id="text-socket-btn" class="modal-button confirm">Socket Gem</button>
                                </div>
                                <hr class="border-t border-gray-600">
                                <div>
                                    <h4 class="font-orbitron text-lg mb-2 text-glow-label">Socketed Items</h4>
                                    <div id="text-socketed-items-display" class="text-sm font-mono space-y-1 text-gray-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="infusion-unsocket-panel" class="tab-panel primary-panel">
                        <h3 class="text-lg font-orbitron mb-3 text-glow-label"><i class="gg-anvil mr-2"></i>Items with Gems</h3>
                        <div class="pouch-background">
                            <div id="item-filter-bar-unsocket" class="flex flex-col gap-3"></div>
                            <div id="item-inventory-grid-unsocket" class="inventory-grid mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        ui.tabContentInfusion.innerHTML = infusionContent;
        this.addEventListeners();
        this.switchTab('socket', true); // Initial render
    },

    switchTab(tabName, isPrimary) {
        if (isPrimary) {
            state.ui.activeTab = tabName;
            document.querySelectorAll('#infusion-container .primary-tab-button, #infusion-container .primary-panel').forEach(el => el.classList.remove('active'));
            document.querySelector(`#infusion-container .primary-tab-button[data-tab="${tabName}"]`).classList.add('active');
            document.getElementById(`infusion-${tabName}-panel`).classList.add('active');
        } else { // Secondary tab switch (Visual/Text)
            state.ui.activeSocketView = tabName;
            document.querySelectorAll('#infusion-container .secondary-tab-button, #infusion-container .secondary-panel').forEach(el => el.classList.remove('active'));
            document.querySelector(`#infusion-container .secondary-tab-button[data-view="${tabName}"]`).classList.add('active');
            document.getElementById(`socket-${tabName}-view`).classList.add('active');
        }

        state.ui.selectedGemForSocketing = null; // Clear selection on tab switch
        this.renderAll();
    },

    addEventListeners() {
        const container = document.getElementById('infusion-container');
        // Modals are now created dynamically, so their backdrops must be created before adding listeners
        this.createInfusionModals();
        const infoModalBackdrop = document.getElementById('info-modal-backdrop');

        if (container) {
            container.addEventListener('click', e => {
                const primaryTabBtn = e.target.closest('.primary-tab-button');
                const secondaryTabBtn = e.target.closest('.secondary-tab-button');
                const gemItem = e.target.closest('.gem-item');
                const inventoryItem = e.target.closest('.inventory-slot');
                const itemFilterBtn = e.target.closest('.item-filter-btn');
                const gemFilterBtn = e.target.closest('.gem-filter-btn');
                const infoBtn = e.target.closest('#info-button');
                const textSocketBtn = e.target.closest('#text-socket-btn');

                if (primaryTabBtn) this.switchTab(primaryTabBtn.dataset.tab, true);
                if (secondaryTabBtn) this.switchTab(secondaryTabBtn.dataset.view, false);
                if (gemItem) this.showGemTooltip(gemItem.dataset.gemid, gemItem.dataset.grade);
                if (itemFilterBtn) this.handleItemFilterClick(itemFilterBtn);
                if (gemFilterBtn) this.handleGemFilterClick(gemFilterBtn);
                if (infoBtn) this.showInfoModal();
                if (textSocketBtn) this.handleTextSocket();

                if (inventoryItem) {
                    if (state.ui.activeTab === 'socket') {
                        this.handleSocketItemClick(inventoryItem.dataset.instanceId);
                    } else {
                        this.showUnsocketChoiceModal(inventoryItem.dataset.instanceId);
                    }
                }
            });

            container.addEventListener('change', e => {
                const select = e.target.closest('.item-tier-filter');
                if (select) {
                    state.ui.itemFilter.tier = select.value;
                    this.renderAll();
                }
            });
        }
        
        if (infoModalBackdrop) {
            infoModalBackdrop.addEventListener('click', (e) => {
                if (e.target.id === 'info-modal-backdrop' || e.target.closest('#info-modal-close-btn')) {
                    this.hideInfoModal();
                }
            });
        }
    },
    
    createInfusionModals() {
        const modalArea = document.getElementById('modal-container');
        if (!modalArea.querySelector('#info-modal-backdrop')) {
            modalArea.innerHTML += `
            <div id="info-modal-backdrop" class="modal-backdrop" style="display: none;">
                <div id="info-modal-content" class="modal-content glass-panel p-6 rounded-lg">
                    <h3 class="font-orbitron text-xl text-center mb-4 text-glow-label">Infusion Guide</h3>
                    <div class="modal-body custom-scrollbar">
                        <div class="space-y-4">
                            <div>
                                <h4 class="font-orbitron text-lg mb-2 text-glow-label">Color Key</h4>
                                <ul class="space-y-2 text-sm">
                                    <li class="flex items-center"><div class="w-5 h-5 rounded-full mr-3" style="background-color: var(--glow-fighter);"></div> Red Gem = Fighter Gem</li>
                                    <li class="flex items-center"><div class="w-5 h-5 rounded-full mr-3" style="background-color: var(--glow-caster);"></div> Blue Gem = Caster Gem</li>
                                    <li class="flex items-center"><div class="w-5 h-5 rounded-full mr-3" style="background-color: var(--glow-misc);"></div> Green Gem = Misc Gem</li>
                                    <li class="flex items-center"><div class="w-5 h-5 rounded-sm mr-3" style="background-color: var(--gold-color);"></div> Yellow Label = Item Tier</li>
                                    <li class="flex items-center"><div class="w-5 h-5 rounded-full mr-3 glow-partial" style="box-shadow: 0 0 8px 2px var(--glow-partial);"></div> Blue Item Glow = 1 Gem Socketed</li>
                                    <li class="flex items-center"><div class="w-5 h-5 rounded-full mr-3 glow-full" style="box-shadow: 0 0 8px 2px var(--glow-full);"></div> Red Item Glow = Item Full (2 Gems)</li>
                                </ul>
                            </div>
                            <hr class="border-t border-gray-600">
                            <div>
                                <h4 class="font-orbitron text-lg mb-2 text-glow-label">How to Socket</h4>
                                <ol class="list-decimal list-inside space-y-1 text-sm pl-2">
                                    <li>Use filters to find the <strong>Gem</strong> you want to socket.</li>
                                    <li>Click the Gem, then click 'Select for Socketing'.</li>
                                    <li>The selected Gem will be highlighted.</li>
                                    <li>Use filters to find the <strong>Item</strong> you want to infuse.</li>
                                    <li>Click the Item to open the confirmation window and complete the infusion.</li>
                                </ol>
                            </div>
                            <hr class="border-t border-gray-600">
                            <div>
                                <h4 class="font-orbitron text-lg mb-2 text-glow-label">How to Unsocket</h4>
                                <ol class="list-decimal list-inside space-y-1 text-sm pl-2">
                                    <li>Go to the 'Unsocket' tab.</li>
                                    <li>Find the item you wish to modify.</li>
                                    <li>Click the item to open the menu.</li>
                                    <li>Choose to 'Unsocket' (costs gold, returns gems) or 'Destroy' (free, gems are lost).</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <button id="info-modal-close-btn" class="modal-button confirm w-full mt-6">Got it</button>
                </div>
            </div>
            <div id="gem-tooltip-backdrop" class="modal-backdrop" style="display: none;">
                <div id="gem-tooltip-content" class="modal-content glass-panel p-4 rounded-lg"></div>
            </div>
            <div id="socket-confirm-backdrop" class="modal-backdrop" style="display: none;">
                <div id="socket-confirm-content" class="modal-content glass-panel p-4 rounded-lg"></div>
            </div>
            <div id="unsocket-choice-modal-backdrop" class="modal-backdrop" style="display: none;">
                <div id="unsocket-choice-modal-content" class="modal-content glass-panel p-4 rounded-lg"></div>
            </div>`;
        }
    },

    showInfoModal() {
        document.getElementById('info-modal-backdrop').style.display = 'flex';
        document.getElementById('info-modal-content').style.display = 'block';
    },

    hideInfoModal() {
        document.getElementById('info-modal-backdrop').style.display = 'none';
        document.getElementById('info-modal-content').style.display = 'none';
    },

    renderAll() {
        this.renderGemFilterBars();
        this.renderGemPouch();
        this.renderItemFilterBar('socket');
        this.renderItemFilterBar('unsocket');
        this.renderFilteredInventory('socket');
        this.renderFilteredInventory('unsocket');
        this.populateTextViewDropdowns();
        this.renderTextSocketedItems();
    },

    renderGemFilterBars() {
        const { type, grade } = state.ui.gemFilter;
        const typeBar = document.getElementById('gem-type-filter-bar');
        const gradeBar = document.getElementById('gem-grade-filter-bar');
        if(!typeBar || !gradeBar) return;

        const gemTypes = ['All', ...new Set(Object.values(GDD.GEMS).map(g => g.type))];
        const gemGrades = ['All', ...Array.from({length: 9}, (_, i) => `${i+1}`)];

        typeBar.innerHTML = gemTypes.map(t => `<button class="filter-btn gem-filter-btn ${t === type ? 'active' : ''}" data-filter-type="type" data-value="${t}">${t}</button>`).join('');
        gradeBar.innerHTML = gemGrades.map(g => `<button class="filter-btn gem-filter-btn ${g === grade ? 'active' : ''}" data-filter-type="grade" data-value="${g}">${g === 'All' ? 'All' : `G${g}`}</button>`).join('');
    },

    handleGemFilterClick(btn) {
        const { filterType, value } = btn.dataset;
        state.ui.gemFilter[filterType] = value;
        this.renderGemFilterBars();
        this.renderGemPouch();
    },

    renderItemFilterBar(view) {
        const filterBar = document.getElementById(`item-filter-bar-${view}`);
        if (!filterBar) return;

        const { category, subType, tier } = state.ui.itemFilter;
        const categories = ['All', ...new Set(GDD.ITEMS.baseItemTemplates.map(i => i.type))];
        let subTypes = ['All'];
        if (category !== 'All') {
            subTypes.push(...new Set(GDD.ITEMS.baseItemTemplates.filter(i => i.type === category).map(i => i.subType).filter(Boolean)));
        }
        const tiers = ['All', ...Array.from({length: GDD.MAX_TIER}, (_, i) => `${i+1}`)];

        const catButtons = categories.map(c => `<button class="filter-btn item-filter-btn ${c === category ? 'active' : ''}" data-filter-type="category" data-value="${c}">${c}</button>`).join('');
        const subTypeButtons = subTypes.length > 1 ? subTypes.map(s => `<button class="filter-btn item-filter-btn ${s === subType ? 'active' : ''}" data-filter-type="subType" data-value="${s}">${s}</button>`).join('') : '';
        const tierDropdown = `<select class="editor-input item-tier-filter !w-auto !text-xs">${tiers.map(t => `<option value="${t}" ${t === tier ? 'selected' : ''}>${t === 'All' ? 'All Tiers' : `T${t}`}</option>`).join('')}</select>`;

        filterBar.innerHTML = `
        <div class="filter-group">${catButtons}</div>
        ${subTypes.length > 1 ? `<div class="filter-group">${subTypeButtons}</div>` : ''}
        <div class="filter-group">${tierDropdown}</div>
        `;
    },

    handleItemFilterClick(btn) {
        const { filterType, value } = btn.dataset;
        if (filterType === 'category') {
            state.ui.itemFilter.category = value;
            state.ui.itemFilter.subType = 'All';
        } else {
            state.ui.itemFilter.subType = value;
        }
        this.renderAll();
    },

    renderFilteredInventory(view) {
        const gridElement = document.getElementById(`item-inventory-grid-${view}`);
        if (!gridElement) return;

        const { category, subType, tier } = state.ui.itemFilter;

        const items = state.player.inventory.filter(item => {
            const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            if (!base) return false;

            if (view === 'socket' && item.socketedGems.length >= base.sockets) return false;
            if (view === 'unsocket' && item.socketedGems.length === 0) return false;
            if (category !== 'All' && base.type !== category) return false;
            if (subType !== 'All' && base.subType !== subType) return false;
            if (tier !== 'All' && item.tier.toString() !== tier) return false;

            return true;
        });

        gridElement.innerHTML = items.map(item => {
            const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            const gemCount = item.socketedGems.filter(Boolean).length;
            let glowClass = '';
            if (gemCount > 0) {
                glowClass = gemCount === base.sockets ? 'glow-full' : 'glow-partial';
            }

            let overlaysHTML = InventoryManager.generateGemOverlaysHTML(item);

            return `
            <div class="inventory-slot" data-instance-id="${item.instanceId}">
                <div class="item-glow-container ${glowClass}"></div>
                ${overlaysHTML}
                <img src="${base.imageUrl}" alt="${base.name}" onerror="this.onerror=null;this.src='https://placehold.co/72x72/1f2937/ffffff?text=ERR';">
                <span class="item-tier-label">T${item.tier}</span>
            </div>`;
        }).join("");
    },

    renderGemPouch() {
        const gemGrid = document.getElementById('infusion-gem-pouch-grid');
        if (!gemGrid) return;
        const { type, grade } = state.ui.gemFilter;
        const filteredGems = state.player.gems.filter(gemInfo =>
            (grade === 'All' || gemInfo.grade.toString() === grade) &&
            (type === 'All' || GDD.GEMS[gemInfo.id].type === type)
        );
        gemGrid.innerHTML = filteredGems.map(gemInfo => {
            const gem = GDD.GEMS[gemInfo.id];
            const isSelected = state.ui.selectedGemForSocketing?.id === gemInfo.id && state.ui.selectedGemForSocketing?.grade === gemInfo.grade;
            return `
            <div class="gem-item gem-type-${gem.type} ${isSelected ? 'selected-for-socket' : ''}" data-gemid="${gemInfo.id}" data-grade="${gemInfo.grade}">
                <img src="${gem.imageUrl}" alt="${gem.name}" class="w-10 h-10" onerror="this.onerror=null; this.src='https://placehold.co/40x40/1f2937/ffffff?text=ERR';">
                <span class="item-label">${gem.abbreviation}${gemInfo.grade}</span>
            </div>`;
        }).join("");
    },

    populateTextViewDropdowns() {
        const itemSelect = document.getElementById('text-item-select');
        const gemSelect = document.getElementById('text-gem-select');
        if (!itemSelect || !gemSelect) return;

        const availableItems = state.player.inventory.filter(item => {
            const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            return base && item.socketedGems.length < base.sockets;
        });

        if (availableItems.length > 0) {
            itemSelect.innerHTML = availableItems.map(item => {
                const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
                return `<option value="${item.instanceId}">(SD)${base.name}T${item.tier}</option>`;
            }).join('');
        } else {
            itemSelect.innerHTML = `<option value="">No Available Items</option>`;
        }

        if (state.player.gems.length > 0) {
            gemSelect.innerHTML = state.player.gems.map(gem => {
                const base = GDD.GEMS[gem.id];
                return `<option value="${gem.id}:${gem.grade}">${base.name}${gem.grade}</option>`;
            }).join('');
        } else {
            gemSelect.innerHTML = `<option value="">No Available Gems</option>`;
        }
    },

    renderTextSocketedItems() {
        const display = document.getElementById('text-socketed-items-display');
        if (!display) return;
        const socketedItems = state.player.inventory.filter(item => item.socketedGems.length > 0);

        if (socketedItems.length === 0) {
            display.innerHTML = '<p>No items with gems socketed.</p>';
            return;
        }

        display.innerHTML = socketedItems.map(item => {
            const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
            const gemStrings = item.socketedGems.map(g => `[${GDD.GEMS[g.id].abbreviation}${g.grade}]`).join('');
            return `<div>(SD)${base.name}T${item.tier}${gemStrings}</div>`;
        }).join('');
    },

    handleTextSocket() {
        const itemSelect = document.getElementById('text-item-select');
        const gemSelect = document.getElementById('text-gem-select');

        if (!itemSelect.value || !gemSelect.value) {
            showToast("Please select both an item and a gem.", true);
            return;
        }

        const instanceId = itemSelect.value;
        const [gemId, gemGradeStr] = gemSelect.value.split(':');
        const gemGrade = parseInt(gemGradeStr);

        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const gemIndexInPouch = state.player.gems.findIndex(g => g.id === gemId && g.grade === gemGrade);

        if (!item || gemIndexInPouch === -1) {
            showToast("Error: Selected item or gem not found.", true);
            return;
        }

        const gemToSocket = state.player.gems[gemIndexInPouch];

        state.player.gems.splice(gemIndexInPouch, 1);
        item.socketedGems.push(gemToSocket);

        showToast("Item infused successfully via text view!", false);
        this.renderAll();
        ProfileManager.calculateAllStats();
    },

    showGemTooltip(gemId, grade) {
        const gem = GDD.GEMS[gemId];
        const modalContent = document.getElementById('gem-tooltip-content');

        modalContent.innerHTML = `
        <div class="text-center">
            <div class="gem-item gem-type-${gem.type} !w-20 !h-20 mx-auto !border-4">
                <img src="${gem.imageUrl}" class="mx-auto w-16 h-16 object-contain" onerror="this.onerror=null;this.src='https://placehold.co/64x64/1f2937/ffffff?text=ERR';">
            </div>
            <h3 class="font-orbitron text-lg mt-2">${gem.name} (Grade ${grade})</h3>
            <p class="text-gray-300 mt-1">${gem.stats}</p>
            <div class="flex gap-2 mt-4">
                <button id="gem-tooltip-socket-btn" class="modal-button confirm">Select for Socketing</button>
                <button id="gem-tooltip-cancel-btn" class="modal-button">Cancel</button>
            </div>
        </div>`;

        document.getElementById('gem-tooltip-backdrop').style.display = 'flex';
        modalContent.style.display = 'block';

        modalContent.querySelector('#gem-tooltip-socket-btn').onclick = () => {
            state.ui.selectedGemForSocketing = { id: gemId, grade: parseInt(grade) };
            this.renderGemPouch();
            this.hideGemTooltip();
            showToast(`${gem.name} selected. Choose an item to infuse.`, false);
        };
        modalContent.querySelector('#gem-tooltip-cancel-btn').onclick = () => this.hideGemTooltip();
        document.getElementById('gem-tooltip-backdrop').onclick = (e) => {
            if(e.target.id === 'gem-tooltip-backdrop') this.hideGemTooltip();
        };
    },

    hideGemTooltip() {
        document.getElementById('gem-tooltip-backdrop').style.display = 'none';
        document.getElementById('gem-tooltip-content').style.display = 'none';
    },

    handleSocketItemClick(instanceId) {
        if (!state.ui.selectedGemForSocketing) {
            showToast("Select a gem from your pouch first.", true);
            return;
        }
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
        if (item.socketedGems.length >= base.sockets) {
            showToast("This item has no empty sockets.", true);
            return;
        }
        this.showSocketConfirmModal(instanceId);
    },

    showSocketConfirmModal(instanceId) {
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const baseItem = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
        const gemInfo = state.ui.selectedGemForSocketing;
        const gem = GDD.GEMS[gemInfo.id];
        const modalContent = document.getElementById('socket-confirm-content');

        modalContent.innerHTML = `
        <h3 class="font-orbitron text-lg text-center mb-4">Confirm Infusion</h3>
        <div class="flex items-center justify-around">
            <div class="text-center">
                <div class="gem-item gem-type-${gem.type} !w-20 !h-20 mx-auto !border-2">
                    <img src="${gem.imageUrl}" class="w-16 h-16">
                </div>
                <p class="text-sm mt-1">${gem.name} G${gemInfo.grade}</p>
            </div>
            <i class="gg-arrow-right-o text-2xl text-gray-400"></i>
            <div class="text-center">
                <div class="inventory-slot !w-20 !h-20 !p-0 !border-0 mx-auto">
                    <img src="${baseItem.imageUrl}" class="!p-2">
                </div>
                <p class="text-sm mt-1">${baseItem.name} T${item.tier}</p>
            </div>
        </div>
        <div class="flex gap-2 mt-6">
            <button id="socket-confirm-btn" class="modal-button confirm">Confirm</button>
            <button id="socket-cancel-btn" class="modal-button">Cancel</button>
        </div>`;

        document.getElementById('socket-confirm-backdrop').style.display = 'flex';
        modalContent.style.display = 'block';

        modalContent.querySelector('#socket-confirm-btn').onclick = () => this.socketGem(instanceId);
        modalContent.querySelector('#socket-cancel-btn').onclick = () => this.hideSocketConfirmModal();
        document.getElementById('socket-confirm-backdrop').onclick = (e) => {
            if(e.target.id === 'socket-confirm-backdrop') this.hideSocketConfirmModal();
        };
    },

    hideSocketConfirmModal() {
        document.getElementById('socket-confirm-backdrop').style.display = 'none';
        document.getElementById('socket-confirm-content').style.display = 'none';
    },

    socketGem(instanceId) {
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const gemToSocket = state.ui.selectedGemForSocketing;
        const gemIndexInPouch = state.player.gems.findIndex(g => g.id === gemToSocket.id && g.grade === gemToSocket.grade);

        if (gemIndexInPouch === -1) {
            showToast("Error: Selected gem not found.", true); return;
        }

        state.player.gems.splice(gemIndexInPouch, 1);
        item.socketedGems.push(gemToSocket);

        state.ui.selectedGemForSocketing = null;
        showToast("Item infused successfully!", false);
        this.hideSocketConfirmModal();
        this.renderAll();
        ProfileManager.calculateAllStats();
    },

    showUnsocketChoiceModal(instanceId) {
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const base = GDD.ITEMS.baseItemTemplates.find(b => b.id === item.baseItemId);
        const modalContent = document.getElementById('unsocket-choice-modal-content');
        const gemCount = item.socketedGems.length;
        let glowClass = gemCount > 0 ? (gemCount === base.sockets ? 'glow-full' : 'glow-partial') : '';

        modalContent.innerHTML = `
        <div class="focused-item-container text-center">
            <div class="inventory-slot mx-auto !w-24 !h-24 !p-0 !border-0">
                <div class="item-glow-container ${glowClass}"></div>
                <img src="${base.imageUrl}" class="!p-2" onerror="this.onerror=null;this.src='https://placehold.co/96x96/1f2937/ffffff?text=ERR';">
            </div>
            <div class="focused-item-details mt-2"><div class="font-orbitron text-lg">${base.name}</div></div>
            <p class="text-sm text-gray-400 my-4">Choose an action for the ${gemCount} socketed gem(s).</p>
            <div class="flex flex-col gap-3">
                <button id="unsocket-btn" class="modal-button">Unsocket All <span style="color:var(--gold-color)">(${GDD.UNSOCKET_COST} G)</span></button>
                <button id="destroy-gems-btn" class="modal-button destroy">Destroy All (Free)</button>
            </div>
        </div>`;

        document.getElementById('unsocket-choice-modal-backdrop').style.display = 'flex';
        modalContent.style.display = 'block';

        modalContent.querySelector('#unsocket-btn').onclick = () => this.unsocketItem(instanceId);
        modalContent.querySelector('#destroy-gems-btn').onclick = () => this.destroyGems(instanceId);
        document.getElementById('unsocket-choice-modal-backdrop').onclick = (e) => {
            if(e.target.id === 'unsocket-choice-modal-backdrop') this.hideUnsocketChoiceModal();
        };
    },

    hideUnsocketChoiceModal() {
        document.getElementById('unsocket-choice-modal-backdrop').style.display = 'none';
        document.getElementById('unsocket-choice-modal-content').style.display = 'none';
    },

    unsocketItem(instanceId) {
        if (state.player.gold < GDD.UNSOCKET_COST) {
            showToast(`Not enough gold. Cost: ${GDD.UNSOCKET_COST}`, true); return;
        }
        state.player.gold -= GDD.UNSOCKET_COST;
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        const removedGems = item.socketedGems.filter(Boolean);
        state.player.gems.push(...removedGems);
        item.socketedGems = [];
        showToast(`Gems unsocketed for ${GDD.UNSOCKET_COST} gold.`, false);
        this.hideUnsocketChoiceModal();
        this.renderAll();
        ProfileManager.calculateAllStats();
        ProfileManager.updateAllProfileUI();
    },

    destroyGems(instanceId) {
        const item = state.player.inventory.find(i => i.instanceId === instanceId);
        item.socketedGems = [];
        showToast("Gems destroyed.", false);
        this.hideUnsocketChoiceModal();
        this.renderAll();
        ProfileManager.calculateAllStats();
    }
};

const UIManager = {
    updatePlayerStatusUI() {
        if (!state.player) return;
        const p = state.player;

        const archetypeAbbr = {
            'True Fighter': 'FTR',
            'True Caster': 'CST',
            'Hybrid': 'HYB'
        }[p.archetype] || 'N/A';

        const cciParts = p.cci.split('/');
        const specialization = cciParts[0] === cciParts[1] ? cciParts[0] : p.cci;
        const aspecValue = `${archetypeAbbr}-${specialization}`;

        ui.playerNameLevelValue.textContent = `${p.name} Lvl: ${p.level}`;
        ui.playerRaceValue.textContent = p.race;
        ui.playerAspecValue.textContent = aspecValue;
        ui.zoneNameValue.textContent = state.zone.name;
        ui.playerCoordsValue.textContent = `(${p.pos.x},${p.pos.y})`;
    },
    flashStatUpdate(attr) {
        const statValueEl = document.querySelector(`[data-stat-value="${attr}"]`);
        const unspentPointsEl = document.getElementById('unspent-points-value');
        if (statValueEl) {
            statValueEl.classList.add('flash-update');
            setTimeout(() => statValueEl.classList.remove('flash-update'), 500);
        }
        if (unspentPointsEl) {
            unspentPointsEl.classList.add('flash-update');
            setTimeout(() => unspentPointsEl.classList.remove('flash-update'), 500);
        }
    }
};

const GameManager = {
    isInitialized: false,
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        ui.gameHudScreen.style.display = 'block'; // Use style instead of class for initial show
        ProfileManager.calculateAllStats();
        ProfileManager.updateAllProfileUI();
        WorldMapManager.init();
        initControls();
        this.setupEventListeners();
        this.switchTab('equipment');
        LayoutManager.init();
        console.log("Game Initialized. Player created:", state.player);
    },
    setupEventListeners() {
        ui.mainTabsContainer.addEventListener('click', (e) => {
            if (state.ui.isLayoutEditMode) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (e.target.classList.contains('main-tab-button')) {
                this.switchTab(e.target.dataset.tab);
            }
        });
        ui.focusModeBtn.addEventListener('click', () => {
            state.ui.isFocused = !state.ui.isFocused;
            ui.mainContent.classList.toggle('focused', state.ui.isFocused);
        });
        ui.toggleControlsBtn.addEventListener('click', () => {
            ui.footerSection.classList.toggle('controls-hidden');
        });
        ui.layoutEditBtn.addEventListener('click', () => {
            LayoutManager.toggleEditMode();
        });
    },
    switchTab(tabName) {
        document.querySelectorAll('#main-tabs-container .main-tab-button, #main-tab-content .main-tab-panel').forEach(el => el.classList.remove('active'));
        const tabButton = document.querySelector(`.main-tab-button[data-tab="${tabName}"]`);
        const tabPanel = document.getElementById(`tab-content-${tabName}`);
        if (tabButton) tabButton.classList.add('active');
        if (tabPanel) tabPanel.classList.add('active');
        switch(tabName) {
            case 'combat': CombatManager.init(); break;
            case 'stats': StatsManager.init(); break;
            case 'inventory': InventoryManager.init(); break;
            case 'equipment': EquipmentManager.init(); break;
            case 'infusion': InfusionManager.init(); break;
            case 'settings': SettingsManager.init(); break;
        }
    }
};

const LayoutManager = {
    selectedItem: null,
    initialPinchDistance: 0,
    resizingElement: null,

    init() {
        this.loadLayout();
        this.addEventListeners();
    },
    toggleEditMode() {
        state.ui.isLayoutEditMode = !state.ui.isLayoutEditMode;
        document.getElementById('layout-container').classList.toggle('layout-edit-mode', state.ui.isLayoutEditMode);
        if (!state.ui.isLayoutEditMode) {
            if (this.selectedItem) {
                this.selectedItem.classList.remove('layout-selected');
                this.selectedItem = null;
            }
            this.saveLayout();
            showToast('Layout Saved!');
        } else {
            showToast('Layout Edit: Tap to select, tap again to swap.');
        }
    },
    addEventListeners() {
        const container = document.getElementById('layout-container');
        container.addEventListener('click', e => this.handleTap(e));
        container.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: false });
        container.addEventListener('touchmove', e => this.handleTouchMove(e), { passive: false });
        container.addEventListener('touchend', e => this.handleTouchEnd(e));
    },
    handleTap(e) {
        if (!state.ui.isLayoutEditMode) return;

        const tappedTab = e.target.closest('.tappable-tab');
        if (tappedTab) {
            e.preventDefault(); e.stopPropagation();
            this.processSelection(tappedTab, 'tab');
            return;
        }

        const tappedSection = e.target.closest('.tappable-section');
        if (tappedSection) {
            this.processSelection(tappedSection, 'section');
        }
    },
    processSelection(element, type) {
        if (!this.selectedItem) {
            this.selectedItem = element;
            element.classList.add('layout-selected');
        } else {
            if (this.selectedItem === element) {
                element.classList.remove('layout-selected');
                this.selectedItem = null;
            } else if (this.selectedItem.classList.contains(`tappable-${type}`) && element.classList.contains(`tappable-${type}`)) {
                const parent = element.parentNode;
                const selectedNext = this.selectedItem.nextSibling;
                parent.insertBefore(this.selectedItem, element);
                parent.insertBefore(element, selectedNext);
                this.selectedItem.classList.remove('layout-selected');
                this.selectedItem = null;
            } else {
                this.selectedItem.classList.remove('layout-selected');
                this.selectedItem = element;
                element.classList.add('layout-selected');
            }
        }
    },
    handleTouchStart(e) {
        if (!state.ui.isLayoutEditMode || e.touches.length !== 2) return;
        this.resizingElement = e.target.closest('.tappable-section');
        if (!this.resizingElement) return;
        e.preventDefault();
        this.initialPinchDistance = this.getPinchDistance(e.touches);
        this.resizingElement.style.transition = 'none'; // Disable transition for smooth resizing
    },
    handleTouchMove(e) {
        if (!state.ui.isLayoutEditMode || e.touches.length !== 2 || !this.resizingElement) return;
        e.preventDefault();
        const newPinchDistance = this.getPinchDistance(e.touches);
        const scale = newPinchDistance / this.initialPinchDistance;

        const currentHeight = this.resizingElement.offsetHeight;
        let newHeight = currentHeight * scale;

        // Clamp the height between min and max values
        const minHeight = 80; // 80px minimum
        const maxHeight = ui.layoutContainer.offsetHeight * 0.7; // 70% of total height
        newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

        this.resizingElement.style.flexBasis = `${newHeight}px`;
        this.resizingElement.style.flexGrow = '0';
        this.resizingElement.style.flexShrink = '0';

        this.initialPinchDistance = newPinchDistance; // Update for next move event
    },
    handleTouchEnd(e) {
        if (this.resizingElement) {
            this.resizingElement.style.transition = ''; // Re-enable transitions
            this.resizingElement = null;
            this.initialPinchDistance = 0;
        }
    },
    getPinchDistance(touches) {
        const touch1 = touches[0];
        const touch2 = touches[1];
        return Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);
    },
    saveLayout() {
        const layoutData = {
            sections: [],
            tabs: [...document.querySelectorAll('.tappable-tab')].map(el => el.dataset.tab)
        };
        document.querySelectorAll('.tappable-section').forEach(el => {
            layoutData.sections.push({
                id: el.id,
                size: el.style.flexBasis || null
            });
        });
        localStorage.setItem('geminusLayout', JSON.stringify(layoutData));
    },
    loadLayout() {
        const savedLayout = JSON.parse(localStorage.getItem('geminusLayout'));
        if (savedLayout) {
            const sectionContainer = document.getElementById('layout-container');
            const sectionMap = new Map();
            [...sectionContainer.children].forEach(child => sectionMap.set(child.id, child));

            savedLayout.sections.forEach(sectionData => {
                const el = sectionMap.get(sectionData.id);
                if(el) {
                    sectionContainer.appendChild(el);
                    if (sectionData.size) {
                        el.style.flexBasis = sectionData.size;
                        el.style.flexGrow = '0';
                        el.style.flexShrink = '0';
                    }
                }
            });

            const tabContainer = document.getElementById('main-tabs-container');
            savedLayout.tabs.forEach(tab => {
                const el = tabContainer.querySelector(`[data-tab="${tab}"]`);
                if(el) tabContainer.appendChild(el);
            });
        }
    }
};

// --- Main Initialization
function main() {
    SettingsManager.loadTheme();
    CreationManager.init();
}

document.addEventListener('DOMContentLoaded', main);
