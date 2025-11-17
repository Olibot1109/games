var Globals = pc.createScript("globals");
Globals.attributes.add("localPlayer", {
  type: "entity",
  description: "The local player entity.",
}),
  Globals.attributes.add("ui", {
    type: "entity",
    description: "The ui screen entity. should contain all ui aspects.",
  }),
  Globals.attributes.add("remotePlayerGroup", {
    type: "entity",
    description: "The entity contining all the remote players.",
  }),
  Globals.attributes.add("camera", {
    type: "entity",
    description: "The camera entity.",
  }),
  (Globals.prototype.initialize = function () {
    (this.app.globals = {
      localPlayer: this.localPlayer,
      localOutfit: this.localPlayer.script.outfit,
      localEffects: this.localPlayer.script.playerEffects,
      localInventory: this.localPlayer.script.inventory,
      localCharAnims: this.localPlayer.script.charAnims,
      remotePlayerGroup: this.remotePlayerGroup,
      camera: this.camera,
      ui: this.ui,
      activeItem: null,
      activeStation: "world",
      layout: null,
      input: null,
      isSoundOn: !0,
      movementAllowed: !0,
      isAdPlaying: !1,
      scrollZoomBlocked: !1,
      keyboardMovementBlocked: !1,
      formInputOpen: !1,
      starCount: 0,
      version: "1",
      unlockedItems: [],
      unlockedBodyColors: [],
      unlockedMaterials: [],
      unlockedEmotes: [],
      redeemedCodes: [],
      freeCodeUsed: !1,
      collectedCollectibles: {},
      collectibleCurrency: {},
      prizeChestsOpened: [],
      env: {},
      playerName: "",
      playerNameWasChanged: !1,
      outfitWasChanged: !1,
      customRoomCode: "",
      vipGrantedAt: 0,
    }),
      (this.app.tracking = {
        hasSetEnvironmentColor: !1,
        enteredCompetitionDressing: !1,
        exitedCompetition: !1,
        enteredCompetitionRunway: !1,
        enteredCompetitionAwards: !1,
        competitionVoteCast: !1,
        finishedCompetition: !1,
        numCompetitionsEntered: 0,
        numCompetitionsPlayed: 0,
        numChatMessagesSent: 0,
        openedSeedShop: !1,
        openedPotionShop: !1,
        openedInventory: !1,
        equippedPlant: !1,
        numPatchesOpened: 0,
        numSeedsPurchased: 0,
        numPotionsPurchased: 0,
        numSeedsPlanted: 0,
        numPlantCaresOpened: 0,
        numPotionsUsed: 0,
        numPlantsHarvested: 0,
        numPlantsSold: 0,
        numFountainsActivated: 0,
      });
  });
var PokiSystem = pc.createScript("pokiSystem");
PokiSystem.attributes.add("bypassAds", {
  type: "boolean",
  default: !1,
  description:
    "Used for rapid testing, will auto grant rewards without playing ads. Disabled on any other url than launch.playcanvas.com.",
}),
  PokiSystem.attributes.add("pokiDebug", { type: "boolean" }),
  (PokiSystem.prototype.initialize = function () {
    (this.app.pokiSystem = this),
      (this._measurableEvents = [
        "start_rewarded",
        "player_set_environment_color",
        "num_competitions_played",
        "num_competitions_entered",
        "first_player_jump",
        "num_chat_messages_sent",
        "first_menu_open",
        "first_room_reset",
        "first_competition_exit",
        "stars_collected",
        "creating_a_room",
        "room_successfully_created",
        "joining_a_room",
        "join_room_found",
        "device_init",
        "player_returning",
        "player_new",
        "vip_access_granted",
        "teleport",
        "code_redeem",
        "player_anim_follow",
        "first_inventory_open",
        "num_patches_opened",
        "first_seed_shop_open",
        "first_potion_shop_open",
        "num_seeds_planted",
        "num_plants_harvested",
        "first_plant_equipped",
      ]),
      (this._gameplayState = "stopped"),
      (this._firstGameplayStartDetected = !1),
      (this._commercialBreakTimeout = null),
      this.app.once("poki:firstInteraction", this._gameplayStart, this),
      this.app.once(
        "poki:rewardedBreak:play",
        function () {
          this.app.fire("watcher:track", "player_watched_ad");
        },
        this
      ),
      this.app.on("poki:gameplayStart", this._gameplayStart, this),
      this.app.on("poki:gameplayStop", this._gameplayStop, this),
      this.app.on("poki:rewardedBreak:play", this._smallRewardedBreak, this),
      this.app.on(
        "poki:rewardedBreak:play:small",
        this._smallRewardedBreak,
        this
      ),
      this.app.on(
        "poki:rewardedBreak:play:medium",
        this._mediumRewardedBreak,
        this
      ),
      this.app.on(
        "poki:rewardedBreak:play:large",
        this._largeRewardedBreak,
        this
      ),
      this.app.on("fashionItem:itemClick", this._fashionItemClick, this),
      PokiSDK.init()
        .then(
          function () {
            this.app.fire("poki:ready");
          }.bind(this)
        )
        .catch(
          function () {
            this.app.fire("poki:ready");
          }.bind(this)
        ),
      this.pokiDebug && PokiSDK.setDebug(!0),
      -1 == window.location.href.indexOf("launch.playcanvas.com") &&
        (this.bypassAds = !1),
      this.app.on("poki:ready", this._pokiReady, this);
  }),
  (PokiSystem.prototype._pokiReady = function () {
    PokiSDK.gameLoadingFinished(),
      PokiSDK.measure("game", "loading", "complete"),
      navigator.sendBeacon(
        "https://leveldata.poki.io/clothing-file",
        "a601b558-b49f-46c8-a13e-78b975209c89"
      );
  }),
  (PokiSystem.prototype._fashionItemClick = function () {
    Math.floor(30 * Math.random()) + 1 === 1 &&
      navigator.sendBeacon(
        "https://leveldata.poki.io/loadNewItems",
        "a601b558-b49f-46c8-a13e-78b975209c89"
      );
  }),
  (PokiSystem.prototype.captureError = function (e) {
    PokiSDK.captureError(e);
  }),
  (PokiSystem.prototype._gameplayStart = function (e = null) {
    this.app.globals.isAdPlaying ||
      ("started" != this._gameplayState &&
        (!1 === this._firstGameplayStartDetected
          ? (PokiSDK.gameplayStart(),
            PokiSDK.measure("game", "meaningful", "first"),
            (this._gameplayState = "started"),
            (this._firstGameplayStartDetected = !0),
            e && e())
          : "competition" == this.app.instance.name
          ? (PokiSDK.gameplayStart(),
            (this._gameplayState = "started"),
            e && e())
          : (this._commercialBreakTimeout &&
              (clearTimeout(this._commercialBreakTimeout),
              (this._commercialBreakTimeout = null)),
            (this._commercialBreakTimeout = this._commercialBreak(
              function (e) {
                PokiSDK.gameplayStart(),
                  (this._gameplayState = "started"),
                  e && e();
              }.bind(this, e)
            )))));
  }),
  (PokiSystem.prototype._gameplayStop = function (e = null) {
    "stopped" != this._gameplayState &&
      (PokiSDK.gameplayStop(), (this._gameplayState = "stopped"));
  }),
  (PokiSystem.prototype._smallRewardedBreak = function (e, t = null) {
    this._rewardedBreak("small", e, t);
  }),
  (PokiSystem.prototype._mediumRewardedBreak = function (e, t = null) {
    this._rewardedBreak("medium", e, t);
  }),
  (PokiSystem.prototype._largeRewardedBreak = function (e, t = null) {
    this._rewardedBreak("large", e, t);
  }),
  (PokiSystem.prototype._rewardedBreak = function (e, t, a = null) {
    if (this.bypassAds) return t();
    PokiSDK.rewardedBreak({
      size: e,
      onStart: () => {
        (this.app.globals.isAdPlaying = !0),
          (this.app.systems.sound.volume = 0);
      },
    }).then((e) => {
      (this.app.globals.isAdPlaying = !1),
        e ? t() : a && a(),
        this.app.globals.isSoundOn && (this.app.systems.sound.volume = 1);
    });
  }),
  (PokiSystem.prototype._commercialBreak = function (e) {
    if (this.bypassAds && e) return e();
    const t = pc.now();
    PokiSDK.commercialBreak(() => {
      (this.app.globals.isAdPlaying = !0),
        (this.app.systems.sound.volume = 0),
        window.sendActivity("start_commercial_break");
    }).then((a) => {
      pc.now() - t >= 5e3 && window.sendActivity("finish_commercial_break"),
        this.app.globals.isSoundOn && (this.app.systems.sound.volume = 1),
        (this.app.globals.isAdPlaying = !1),
        e && e();
    });
  }),
  (PokiSystem.prototype._isEventMeasurable = function (e) {
    for (var t = 0; t < this._measurableEvents.length; t++)
      if (-1 !== e.indexOf(this._measurableEvents[t])) return !0;
    return !1;
  }),
  (PokiSystem.prototype.measure = function (e) {
    this._isEventMeasurable(e) &&
      (console.log("tracking poki sdk measure " + e),
      PokiSDK.measure("custom", e));
  });
var FashionItem = pc.createScript("fashionItem");
FashionItem.attributes.add("adIcon", { type: "entity" }),
  FashionItem.attributes.add("currencyIcon", { type: "entity" }),
  FashionItem.attributes.add("currencyPrice", { type: "entity" }),
  FashionItem.attributes.add("isVIP", { type: "boolean", default: !1 }),
  FashionItem.attributes.add("isPremium", { type: "boolean", default: !1 }),
  FashionItem.attributes.add("isPrize", { type: "boolean", default: !1 }),
  FashionItem.attributes.add("itemCat", {
    type: "string",
    enum: [
      { Hair: "hair" },
      { Tops: "tops" },
      { Dresses: "dresses" },
      { Bottoms: "bottoms" },
      { Shoes: "shoes" },
      { Neck: "neck" },
      { Ear: "ear" },
      { Wrist: "wrist" },
      { Eyes: "eyes" },
      { Cheek: "cheek" },
      { Lips: "lips" },
      { Hat: "hats" },
      { Belts: "belts" },
      { Glasses: "glasses" },
      { Bags: "bags" },
      { Coats: "coats" },
      { HeadAccs: "headAccs" },
      { Handhelds: "handhelds" },
      { Back: "back" },
    ],
  });
const pulseTime = 0.3,
  pulseScaleCurve = new pc.Curve([0, 1, 0.5, 1.1, 1, 1]);
(FashionItem.prototype.initialize = function () {
  (this.spinner = this.app.globals.ui.findByName("spinner")),
    (this._isLoaded = !1),
    this.entity.button.on(
      "click",
      function () {
        if (
          ((this.app.globals.activeItem = this.entity.name),
          this.fashItemPulse(),
          this.entity.script.fashionItem.isPremium)
        )
          this.premiumItemClicked();
        else if (this._collectibleCost > 0) {
          if (-1 !== this.app.globals.unlockedItems.indexOf(this.entity.name))
            this.checkIfLoaded(), this.app.fire("fashionItem:itemClick");
          else {
            this.app.collectibles.attemptToSpendCollectibles(
              this._collectibleCurrency,
              this._collectibleCost
            ) &&
              (this.checkIfLoaded(),
              this.app.fire("fashionItem:itemClick"),
              this.app.globals.unlockedItems.push(this.entity.name),
              this.app.saveStats(
                "unlockedItems",
                this.app.globals.unlockedItems
              ),
              (this.currencyIcon.enabled = !1),
              (this.currencyPrice.enabled = !1));
          }
        } else this.checkIfLoaded(), this.app.fire("fashionItem:itemClick");
      },
      this
    ),
    this.app.on(
      "setPremiumInactive",
      function () {
        this.isPremium && this.setPremiumInactive();
      },
      this
    ),
    this.app.on(
      "setPremiumActive",
      function () {
        this.isPremium && this.setPremiumActive();
      },
      this
    );
}),
  (FashionItem.prototype.postInitialize = function () {
    this.localOutfit = this.app.globals.localPlayer.script.outfit;
  }),
  (FashionItem.prototype.setCollectiblePurchaseCost = function (t, e) {
    (this._collectibleCurrency = t),
      (this._collectibleCost = e),
      (this.currencyIcon.enabled = !0),
      (this.currencyPrice.enabled = !0),
      (this.currencyPrice.element.text = e.toString());
  }),
  (FashionItem.prototype.update = function (t) {
    if (this.pulseCountdownS > 0) {
      this.pulseCountdownS -= t;
      let e = 1 - this.pulseCountdownS / 0.3,
        i = pulseScaleCurve.value(e);
      this.entity.setLocalScale(i, i, i);
    }
  }),
  (FashionItem.prototype.fashItemPulse = function () {
    this.pulseCountdownS = 0.3;
  }),
  (FashionItem.prototype.premiumItemClicked = function () {
    let t = !0;
    "competition" == this.app.instance.name &&
      (t = !!this.app.competition.isAdWatchable()),
      t
        ? (this.app.fire(
            "watcher:track",
            "start_rewarded_fashion_item_" + this.entity.name
          ),
          this.app.fire(
            "poki:rewardedBreak:play",
            function () {
              (this.entity.script.fashionItem.isPremium = !1),
                (this.entity.findByName("AdIcon").enabled = !1),
                this.checkIfLoaded(),
                this.app.fire("fashionItem:itemClick"),
                this.app.fire(
                  "watcher:track",
                  "finish_rewarded_fashion_item_" + this.entity.name
                ),
                this.app.globals.unlockedItems.push(this.entity.name),
                this.app.saveStats(
                  "unlockedItems",
                  this.app.globals.unlockedItems
                );
            }.bind(this),
            function () {}.bind(this)
          ))
        : this.app.fire("setPremiumInactive");
  }),
  (FashionItem.prototype.setPremiumInactive = function () {
    this.entity.element.opacity = 0.2;
  }),
  (FashionItem.prototype.setPremiumActive = function () {
    this.entity.element.opacity = 1;
  }),
  (FashionItem.prototype.setVIPActive = function () {
    this.entity.element.enabled = !0;
  }),
  (FashionItem.prototype.setVIPInactive = function () {
    this.entity.element.enabled = !1;
  }),
  (FashionItem.prototype.checkIfLoaded = function () {
    if (this._isLoaded) return void this.setFashionItem();
    let t = this.app.itemDb.getItem(this.entity.name);
    if (t.isNoneItem) this.setFashionItem();
    else if (t) {
      const e = t.getContainerAsset();
      e && e.loaded
        ? this._finishLoading()
        : e &&
          !1 === e.loaded &&
          ((this.spinner.enabled = !0),
          e.ready(this._finishLoading.bind(this)));
    }
  }),
  (FashionItem.prototype._finishLoading = function () {
    (this._isLoaded = !0), (this.spinner.enabled = !1), this.setFashionItem();
  }),
  (FashionItem.prototype.setFashionItem = function (t = !0) {
    switch (
      (null == this.localOutfit &&
        (this.localOutfit = this.app.globals.localPlayer.script.outfit),
      t &&
        (this.app.fire(
          "fashionItem:colorSlots",
          this.app.itemDb.getItem(this.entity.name).colorSlots
        ),
        this.resetButtonColor()),
      this.itemCat)
    ) {
      case "hair":
        (this.entity.element.color = this.app.uiColors.pink),
          this._select("hair", "hairSlot", this.entity.name);
        break;
      case "tops":
        (this.entity.element.color = this.app.uiColors.violet),
          this.app.fire("dressToggle:set:inactive", "topsNoneBtn"),
          this._select("tops", "topSlot", this.entity.name);
        break;
      case "dresses":
        (this.entity.element.color = this.app.uiColors.marigold),
          this.app.fire("dressToggle:set:inactive", "dressNoneBtn"),
          this._select("dresses", "dressSlot", this.entity.name);
        break;
      case "bottoms":
        (this.entity.element.color = this.app.uiColors.purple),
          this.app.fire("dressToggle:set:inactive", "bottomsNoneBtn"),
          this._select("bottoms", "bottomSlot", this.entity.name);
        break;
      case "shoes":
        (this.entity.element.color = this.app.uiColors.indigo),
          this._select("shoes", "shoeSlot", this.entity.name);
        break;
      case "glasses":
        (this.entity.element.color = this.app.uiColors.purple),
          this._select("glasses", "glassesSlot", this.entity.name);
        break;
      case "belts":
        (this.entity.element.color = this.app.uiColors.indigo),
          this._select("belts", "beltSlot", this.entity.name);
        break;
      case "hats":
        (this.entity.element.color = this.app.uiColors.pink),
          this._select("hats", "hatSlot", this.entity.name);
        break;
      case "bags":
        (this.entity.element.color = this.app.uiColors.marigold),
          this._select("bags", "bagSlot", this.entity.name);
        break;
      case "coats":
        (this.entity.element.color = this.app.uiColors.violet),
          this._select("coats", "coatSlot", this.entity.name);
        break;
      case "neck":
        (this.entity.element.color = this.app.uiColors.violet),
          this._select("neck", "neckSlot", this.entity.name);
        break;
      case "ear":
        (this.entity.element.color = this.app.uiColors.violet),
          this._select("ear", "earSlot", this.entity.name);
        break;
      case "wrist":
        (this.entity.element.color = this.app.uiColors.violet),
          this._select("wrist", "wristSlot", this.entity.name);
        break;
      case "eyes":
        (this.entity.element.color = this.app.uiColors.marigold),
          this._select("eyes", "eyeSlot", this.entity.name);
        break;
      case "cheek":
        (this.entity.element.color = this.app.uiColors.marigold),
          this._select("cheek", "cheekSlot", this.entity.name);
        break;
      case "lips":
        (this.entity.element.color = this.app.uiColors.orange),
          this._select("lips", "lipSlot", this.entity.name);
        break;
      case "headAccs":
        (this.entity.element.color = this.app.uiColors.pink),
          this._select("headAccs", "headAccsSlot", this.entity.name);
        break;
      case "handhelds":
        (this.entity.element.color = this.app.uiColors.orange),
          this._select("handhelds", "handheldSlot", this.entity.name);
        break;
      case "back":
        (this.entity.element.color = this.app.uiColors.violet),
          this._select("back", "backSlot", this.entity.name);
    }
    this.app.saveStats("player", this.localOutfit.selection),
      (this.app.globals.outfitWasChanged = !0);
  }),
  (FashionItem.prototype.resetButtonColor = function () {
    this.entity.parent.children.forEach((t) => {
      t.element && (t.element.color = this.app.uiColors.inactive);
    });
  }),
  (FashionItem.prototype._select = function (t, e, i) {
    let s = this.localOutfit.selection[t];
    (s.selected = i),
      this._showConditionalSlots(e),
      this.localOutfit.wearItem(e, s);
  }),
  (FashionItem.prototype._showConditionalSlots = function (t) {
    "dressSlot" == t
      ? this.localOutfit.setDressState(!0)
      : "topSlot" == t || "bottomSlot" == t
      ? this.localOutfit.selection.isWearingDress &&
        this.localOutfit.setDressState(!1)
      : ("coatSlot" != t && "beltSlot" != t && "neckSlot" != t) ||
        (this.localOutfit.selection.isWearingDress &&
          "robe" == this.localOutfit.selection.dresses.selected &&
          this.localOutfit.setDressState(!1));
  });
var SavedFile = pc.createScript("savedFile");
SavedFile.attributes.add("disableLoadingStats", {
  type: "boolean",
  default: !1,
  description:
    "Useful for beta or testing builds so we don't corrupt player savedFile long-term",
}),
  SavedFile.attributes.add("disableSavingStats", {
    type: "boolean",
    default: !1,
    description:
      "Useful for beta or testing builds so we don't corrupt player savedFile long-term",
  }),
  SavedFile.attributes.add("stationPanels", {
    type: "entity",
    description:
      "Entity containing all station UI elements. We hide the ad icons for unlocked premium items",
  }),
  (SavedFile.prototype.initialize = function () {
    (this.app.savedFile = {}),
      (this.app.saveStats = function (e, t) {
        (this.app.savedFile[e] = t),
          (this.app.savedFile.gameVersion = window.gameVersion),
          this.disableSavingStats || this._saveEncoded(this.app.savedFile);
      }.bind(this));
  }),
  (SavedFile.prototype.postInitialize = function () {
    try {
      let e = this.app.localStorage.getItem("savedFile");
      e && e.length > 0
        ? ((this.app.savedFile = JSON.parse(atob(e))),
          this.app.fire("watcher:track", "player_returning"))
        : this.app.fire("watcher:track", "player_new");
    } catch (e) {
      console.error("Stats file failed to load correctly, using defaults");
    }
    this.disableLoadingStats && (this.app.savedFile = {}),
      Object.keys(this.app.savedFile).length > 0
        ? this.loadSavedProperties(this.app.savedFile)
        : this.setDefaults();
  }),
  (SavedFile.prototype._saveEncoded = function (e) {
    let t = JSON.stringify(e),
      a = btoa(t);
    this.app.localStorage.setItem("savedFile", a);
  }),
  (SavedFile.prototype.setDefaults = function () {
    this.app.fire("setNewName"),
      this.app.fire("codes:redeemed:loaded", this.app.globals.redeemedCodes);
  }),
  (SavedFile.prototype.loadSavedProperties = function (e) {
    this.setSound(e),
      this.setName(e),
      this.loadVip(e),
      this.loadCurrency(e),
      this.loadCollectibles(e),
      this.loadOutfitSelection(e),
      this.loadSavedColors(e),
      this.loadUnlockedItems(e),
      this.loadUnlockedBodyColors(e),
      this.loadUnlockedMaterials(e),
      this.loadUnlockedEmotes(e),
      this.loadRedeemedCodes(e),
      this.loadEnvironmentColors(e),
      this.loadInventory(e),
      this.loadGardens(e),
      this.app.savedFile.player &&
        "1" == this.app.savedFile.player.version &&
        (this.wearOutfit(e), this.app.fire("outfit:transmit"));
  }),
  (SavedFile.prototype.setSound = function (e) {
    e.hasOwnProperty("isSoundOn") &&
      ((this.app.globals.isSoundOn = e.isSoundOn),
      this.app.globals.isSoundOn
        ? this.app.fire("soundOn")
        : this.app.fire("soundOff"));
  }),
  (SavedFile.prototype.setName = function (e) {
    e.hasOwnProperty("playerName")
      ? ((this.app.globals.playerName = e.playerName),
        this.app.fire("setExistingName"))
      : this.app.fire("setNewName");
  }),
  (SavedFile.prototype.loadVip = function (e) {
    e.hasOwnProperty("vipGrantedAt") &&
      ((this.app.globals.vipGrantedAt = e.vipGrantedAt),
      this.app.fire("vip:access:loaded"));
  }),
  (SavedFile.prototype.loadCurrency = function (e) {
    e.hasOwnProperty("starCount") &&
      this.app.currency.load({ starCount: e.starCount });
  }),
  (SavedFile.prototype.loadCollectibles = function (e) {
    e.hasOwnProperty("collectedCollectibles") &&
      ((this.app.globals.collectedCollectibles = e.collectedCollectibles),
      this.app.fire("collectibles:loaded", e.collectedCollectibles)),
      e.hasOwnProperty("collectibleCurrency") &&
        (this.app.globals.collectibleCurrency = e.collectibleCurrency),
      e.hasOwnProperty("prizeChestsOpened") &&
        ((this.app.globals.prizeChestsOpened = e.prizeChestsOpened),
        this.app.fire("prizeChests:loaded", e.prizeChestsOpened));
  }),
  (SavedFile.prototype.loadOutfitSelection = function (e) {
    this.app.savedFile.player &&
      "1" == this.app.savedFile.player.version &&
      (this.app.globals.localOutfit.selection = e.player);
  }),
  (SavedFile.prototype.loadSavedColors = function (e) {
    if (e.hasOwnProperty("player")) {
      let t = this.app.globals.localOutfit.selection,
        a = this.app.globals.localPlayer;
      const o = [
        { key: "selectedHairColor", material: "hairMaterial" },
        { key: "selectedHairShadingColor", material: "hairShadingMaterial" },
        { key: "selectedEyebrowColor", material: "eyebrowMaterial" },
      ];
      [
        { key: "selectedSkinColor", material: "skinMaterial" },
        { key: "selectedSkinShadingColor", material: "skinShadingMaterial" },
        { key: "selectedEyeColor", material: "eyeMaterial" },
        { key: "selectedLipColor", material: "lipMaterial" },
        { key: "selectedBlushColor", material: "blushMaterial" },
      ].forEach((o) => {
        void 0 === e.player.body[o.key] &&
          (e.player.body[o.key] = { r: 0.768, g: 0.529, b: 0.4, a: 1 }),
          (t.body[o.key] = e.player.body[o.key]);
        let s = a.script.materialTracker[o.material];
        const l = t.body[o.key];
        s.diffuse.set(l.r, l.g, l.b, l.a);
      }),
        o.forEach((o) => {
          void 0 === e.player.hair[o.key] &&
            (e.player.hair[o.key] = { r: 0.466, g: 0.325, b: 0.27, a: 1 }),
            (t.hair[o.key] = e.player.hair[o.key]);
          let s = a.script.materialTracker[o.material];
          const l = t.hair[o.key];
          s.diffuse.set(l.r, l.g, l.b, l.a);
        }),
        this._wear("dressSlot", t.dresses),
        this._wear("shoeSlot", t.shoes);
    }
  }),
  (SavedFile.prototype.loadUnlockedItems = function (e) {
    e.hasOwnProperty("unlockedItems") &&
      ((this.app.globals.unlockedItems = e.unlockedItems),
      e.unlockedItems.forEach(function (e) {
        let t = this.app.globals.ui.findByName(e);
        t &&
          ((t.script.fashionItem.isPremium = !1),
          (t.script.fashionItem.adIcon.enabled = !1));
      }, this));
  }),
  (SavedFile.prototype.loadUnlockedBodyColors = function (e) {
    e.hasOwnProperty("unlockedBodyColors") &&
      (e.unlockedBodyColors.forEach(function (e) {
        try {
          this.app.colorDb.entity.findByName(e).script.dbBodyColor.isPremium =
            !1;
          let t = this.stationPanels.findByName(e);
          t &&
            ((t.findByName("adIcon").enabled = !1),
            (t.script.bodyColors.isPremium = !1));
        } catch (t) {
          console.error(
            "savedFile loadUnlockedBodyColors: Could not find the following color",
            e,
            t
          );
        }
      }, this),
      (this.app.globals.unlockedBodyColors = e.unlockedBodyColors));
  }),
  (SavedFile.prototype.loadUnlockedMaterials = function (e) {
    e.hasOwnProperty("unlockedMaterials") &&
      (e.unlockedMaterials.forEach(function (e) {
        try {
          this.app.colorDb.entity.findByName(e).script.dbItemColor.isPremium =
            !1;
          let t = this.stationPanels.findByName(e);
          t &&
            ((t.findByName("adIcon").enabled = !1),
            (t.script.colorButton.isPremium = !1));
        } catch (t) {
          console.error(
            "savedFile loadUnlockedMaterials: Could not find the following material",
            e,
            t
          );
        }
      }, this),
      (this.app.globals.unlockedMaterials = e.unlockedMaterials));
  }),
  (SavedFile.prototype.loadEnvironmentColors = function (e) {
    if (e.hasOwnProperty("env")) {
      let t = e.env;
      Object.keys(t).forEach(function (e) {
        let a = this.app.globals.ui.findByName(e),
          o = t[e];
        if ("sky" == e) return;
        "A089A4" == o && (o = "F1D8B9");
        let s = this.app.globals.ui.findByName(o);
        if (a && s && s.script && s.script.colorButton)
          try {
            let e = s.script.colorButton.material.resource.diffuseMapOffset;
            a.script.environmentItem.material.resource.diffuseMapOffset.set(
              e.x,
              e.y
            ),
              a.script.environmentItem.material.resource.update();
          } catch (t) {
            console.error("Error setting color of " + e + " to " + o, t);
          }
      }, this);
    }
  }),
  (SavedFile.prototype.loadUnlockedEmotes = function (e) {
    e.hasOwnProperty("unlockedEmotes") &&
      ((this.app.globals.unlockedEmotes = e.unlockedEmotes),
      e.unlockedEmotes.forEach(function (e) {
        let t = this.app.globals.ui.findByName(e);
        t &&
          ((t.script.emoteButton.isPremium = !1),
          (t.findByName("adIcon").enabled = !1));
      }, this));
  }),
  (SavedFile.prototype.loadRedeemedCodes = function (e) {
    e.hasOwnProperty("redeemedCodes") &&
      (this.app.globals.redeemedCodes = e.redeemedCodes),
      e.hasOwnProperty("freeCodeUsed") &&
        (this.app.globals.freeCodeUsed = e.freeCodeUsed),
      this.app.fire("codes:redeemed:loaded", e.redeemedCodes);
  }),
  (SavedFile.prototype.loadInventory = function (e) {
    e.hasOwnProperty("localInventory") &&
      this.app.globals.localInventory.load(e.localInventory);
  }),
  (SavedFile.prototype.loadGardens = function (e) {
    this.app.afterGroupLoaded("garden", () => {
      e.hasOwnProperty("gardenUnlocks") &&
        this.app.gardening.loadGardenUnlocks(e.gardenUnlocks),
        e.hasOwnProperty("gardenPatches") &&
          this.app.gardening.loadGardenPatches(e.gardenPatches),
        e.hasOwnProperty("fountains") &&
          this.app.gardening.loadFountains(e.fountains),
        e.hasOwnProperty("gardenTutorial") &&
          this.app.gardening.loadTutorial(e.gardenTutorial);
    });
  }),
  (SavedFile.prototype.wearOutfit = function (e) {
    if (this.app.savedFile && this.app.savedFile.hasOwnProperty("player")) {
      let e = this.app.globals.localOutfit,
        t = e.selection;
      e.setDressState(t.isWearingDress),
        t.hair.selected &&
          "hairTowel" != t.hair.selected &&
          this._wear("hairSlot", t.hair),
        t.cheek.selected && this._wear("cheekSlot", t.cheek),
        t.eyes.selected && this._wear("eyeSlot", t.eyes),
        t.lips.selected && this._wear("lipSlot", t.lips),
        t.tops.selected && this._wear("topSlot", t.tops),
        t.bottoms.selected && this._wear("bottomSlot", t.bottoms),
        t.dresses.selected && this._wear("dressSlot", t.dresses),
        t.shoes.selected &&
          "barefoot" != t.shoes.selected &&
          this._wear("shoeSlot", t.shoes),
        t.belts &&
          "beltNone" != t.belts.selected &&
          this._wear("beltSlot", t.belts),
        t.neck &&
          "neckNone" != t.neck.selected &&
          this._wear("neckSlot", t.neck),
        t.ear && "earNone" != t.ear.selected && this._wear("earSlot", t.ear),
        t.wrist &&
          "wristNone" != t.wrist.selected &&
          this._wear("wristSlot", t.wrist),
        t.hats && "hatNone" != t.hats.selected && this._wear("hatSlot", t.hats),
        t.bags &&
          "bagsNone" != t.bags.selected &&
          this._wear("bagSlot", t.bags),
        t.glasses &&
          "glassesNone" != t.glasses.selected &&
          this._wear("glassesSlot", t.glasses),
        t.coats &&
          "coatsNone" != t.coats.selected &&
          this._wear("coatSlot", t.coats),
        t.headAccs && "headAccsNone" != t.headAccs.selected
          ? this._wear("headAccsSlot", t.headAccs)
          : (this.app.globals.localOutfit.selection.headAccs = {
              selected: "headAccsNone",
              color1: "white",
              color2: "white",
              color3: "white",
            }),
        t.handhelds && "handheldNone" != t.handhelds.selected
          ? this._wear("handheldSlot", t.handhelds)
          : ((this.app.globals.localOutfit.selection.handhelds = {
              selected: "handheldNone",
              color1: "white",
              color2: "white",
              color3: "white",
            }),
            this.app.globals.localCharAnims.setHandheldPose(0),
            this.app.globals.localEffects.clear()),
        t.back && "backNone" != t.back.selected
          ? this._wear("backSlot", t.back)
          : (this.app.globals.localOutfit.selection.back = {
              selected: "backNone",
              color1: "white",
              color2: "white",
              color3: "white",
            });
    }
  }),
  (SavedFile.prototype._wear = function (e, t) {
    let a = this.app.itemDb.getItem(t.selected);
    a &&
      ((a.color1 = t.color1),
      (a.color2 = t.color2),
      (a.color3 = t.color3),
      this.app.globals.localOutfit.wearItem(e, t));
  });
var Rotate = pc.createScript("rotate");
Rotate.attributes.add("orbitSensitivity", { type: "number", default: 0.3 }),
  Rotate.attributes.add("rotationEnabled", { type: "boolean", default: !1 }),
  (Rotate.prototype.initialize = function () {
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this),
      (this.lastTouchPoint = new pc.Vec2()),
      this.app.touch &&
        (this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this),
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this)),
      this.on(
        "destroy",
        function () {
          this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this),
            this.app.touch &&
              (this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this),
              this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this));
        },
        this
      ),
      this.app.on(
        "playerRotation",
        function (t) {
          this.togglePlayerRotation(t);
        },
        this
      );
  }),
  (Rotate.horizontalQuat = new pc.Quat()),
  (Rotate.prototype.rotate = function (t) {
    var o = Rotate.horizontalQuat;
    o.setFromAxisAngle(pc.Vec3.UP, t * this.orbitSensitivity),
      o.mul(this.entity.getRotation()),
      this.entity.setRotation(o);
  }),
  (Rotate.prototype.onTouchStart = function (t) {
    var o = t.touches[0];
    this.lastTouchPoint.set(o.x, o.y);
  }),
  (Rotate.prototype.onTouchMove = function (t) {
    if (this.rotationEnabled) {
      var o = t.touches[0],
        i = o.x - this.lastTouchPoint.x,
        e = t.element.offsetHeight,
        a = t.element.offsetWidth;
      if ("portrait" == this.app.globals.layout) {
        var s = 0.6 * e;
        this.lastTouchPoint.y < s && this.rotate(i);
      } else {
        s = 0.6 * a;
        this.lastTouchPoint.x < s && this.rotate(i);
      }
      this.lastTouchPoint.set(o.x, o.y);
    }
  }),
  (Rotate.prototype.onMouseMove = function (t) {
    this.rotationEnabled &&
      this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT) &&
      this.rotate(t.dx);
  }),
  (Rotate.prototype.togglePlayerRotation = function (t) {
    this.rotationEnabled = !!t;
  });
var LocalStorage = pc.createScript("localStorage");
LocalStorage.attributes.add("cookiePrefix", {
  type: "string",
  default: "vortellis",
}),
  (LocalStorage.prototype.initialize = function () {
    (this._isLocalStorageAvailable = this._isAvailable()),
      (this.app.localStorage = this);
  }),
  (LocalStorage.prototype._isAvailable = function () {
    try {
      localStorage.setItem("vtLocalStorage", !0),
        localStorage.removeItem("vtLocalStorage");
    } catch (t) {
      return !1;
    }
    return !0;
  }),
  (LocalStorage.prototype.getItem = function (t) {
    if (this._isLocalStorageAvailable)
      try {
        return localStorage.getItem(this.cookiePrefix + ":" + t);
      } catch (t) {
        return "";
      }
    else this._getCookie(t);
  }),
  (LocalStorage.prototype.setItem = function (t, e) {
    if (this._isLocalStorageAvailable)
      try {
        localStorage.setItem(this.cookiePrefix + ":" + t, e);
      } catch (t) {
        return;
      }
    else this._setCookie(t, e);
  }),
  (LocalStorage.prototype._removeItem = function (t) {
    if (this._isLocalStorageAvailable)
      try {
        localStorage.removeItem(this.cookiePrefix + ":" + t);
      } catch (t) {
        return;
      }
    else this._setCookie(t, "");
  }),
  (LocalStorage.prototype._getCookie = function (t) {
    let e = this.cookiePrefix + ":" + t + "=",
      o = decodeURIComponent(document.cookie).split(";");
    for (let t = 0; t < o.length; t++) {
      let i = o[t];
      for (; " " == i.charAt(0); ) i = i.substring(1);
      if (0 == i.indexOf(e)) return i.substring(e.length, i.length);
    }
    return "";
  }),
  (LocalStorage.prototype._setCookie = function (t, e) {
    const o = new Date();
    o.setTime(o.getTime() + 5184e6);
    let i = "expires=" + o.toUTCString();
    document.cookie =
      this.cookiePrefix + ":" + t + "=" + e + ";" + i + ";path=/";
  });
var ColorButton = pc.createScript("colorButton");
ColorButton.attributes.add("isPremium", { type: "boolean" }),
  ColorButton.attributes.add("hasCustomSprite", {
    type: "boolean",
    default: !1,
    description:
      "Use when the color has a custom sprite to show in the color slot, e.g. shaders, gradients, patterns",
  }),
  ColorButton.attributes.add("material", { type: "asset" }),
  ColorButton.attributes.add("selectedSprite", { type: "asset" }),
  ColorButton.attributes.add("unselectedSprite", { type: "asset" }),
  (ColorButton.prototype.initialize = function () {
    (this.colorClicked = 0),
      this.entity.button.on(
        "click",
        function () {
          "stars" == this.app.globals.activeStation
            ? this.isPremium
              ? (this.app.fire(
                  "watcher:track",
                  "start_rewarded_color_" + this.entity.name
                ),
                this.app.fire(
                  "poki:rewardedBreak:play",
                  function () {
                    (this.isPremium = !1),
                      (this.entity.children[0].enabled = !1),
                      this.app.saveStats(
                        "colorButtonsUnlocked",
                        this.entity.name
                      ),
                      this.app.fire(
                        "watcher:track",
                        "finish_rewarded_color_" + this.entity.name
                      ),
                      this.app.globals.unlockedMaterials.push(this.entity.name),
                      this.app.saveStats(
                        "unlockedMaterials",
                        this.app.globals.unlockedMaterials
                      ),
                      this.setEnvironmentColor(),
                      this.app.fire("setColorSelectedState", this.entity.name),
                      this.app.fire("sound:pop:pitch1.5");
                  }.bind(this),
                  function () {}.bind(this)
                ))
              : (this.setEnvironmentColor(),
                this.app.fire("setColorSelectedState", this.entity.name),
                this.app.fire("sound:pop:pitch1.5"))
            : this.isPremium
            ? this.premiumColorClicked()
            : (this.updateClothesColor(),
              this.app.fire("sound:pop:pitch1.5"),
              this.colorButtonPulse(),
              this.app.fire("colorButton:colorUpdate"),
              this.app.fire("setColorSelectedState", this.entity.name),
              this.colorClicked++,
              (1 != this.colorClicked && this.colorClicked % 5 != 0) ||
                this.app.fire(
                  "watcher:track",
                  "color_clicked_" + this.entity.name + "_" + this.colorClicked
                ));
        },
        this
      ),
      this.app.on(
        "setColorSelectedState",
        function (t) {
          try {
            this.setColorSelectedState(t);
          } catch (e) {
            console.error("Error with setting color:", t);
          }
        },
        this
      ),
      this.app.on(
        "setPremiumInactive",
        function () {
          this.isPremium && this.setPremiumInactive();
        },
        this
      ),
      this.app.on(
        "setPremiumActive",
        function () {
          this.isPremium && this.setPremiumActive();
        },
        this
      );
  }),
  (ColorButton.prototype.update = function (t) {
    if (this.pulseCountdownS > 0) {
      this.pulseCountdownS -= t;
      let e = 1 - this.pulseCountdownS / pulseTime,
        i = pulseScaleCurve.value(e);
      this.entity.setLocalScale(i, i, i);
    }
  }),
  (ColorButton.prototype.premiumColorClicked = function () {
    let t = !0;
    "competition" == this.app.instance.name &&
      (t = !!this.app.competition.isAdWatchable()),
      t
        ? (this.app.fire(
            "watcher:track",
            "start_rewarded_color_" + this.entity.name
          ),
          this.app.fire(
            "poki:rewardedBreak:play",
            function () {
              (this.isPremium = !1),
                (this.entity.findByName("adIcon").enabled = !1),
                this.updateClothesColor(),
                this.app.fire("colorButton:colorUpdate"),
                this.app.fire("setColorSelectedState", this.entity.name),
                this.app.saveStats("colorButtonsUnlocked", this.entity.name),
                this.app.fire(
                  "watcher:track",
                  "finish_rewarded_color_" + this.entity.name
                ),
                this.app.globals.unlockedMaterials.push(this.entity.name),
                this.app.saveStats(
                  "unlockedMaterials",
                  this.app.globals.unlockedMaterials
                );
            }.bind(this),
            function () {}.bind(this)
          ))
        : this.app.fire("setPremiumInactive");
  }),
  (ColorButton.prototype.setPremiumInactive = function () {
    this.entity.element.opacity = 0.2;
  }),
  (ColorButton.prototype.setPremiumActive = function () {
    this.entity.element.opacity = 1;
  }),
  (ColorButton.prototype.updateClothesColor = function () {
    let t = this.app.globals,
      e = this.app.areaSystem.getStation(t.activeStation),
      i = e.script.station.itemSlot,
      o = this.readyActiveItem(t, e, i);
    var s = [],
      a = 0;
    if (
      (i.render.meshInstances.forEach(function (t) {
        t
          ? "skin_blender" != t.material.name &&
            "skinShading_blender" != t.material.name &&
            s.push(a)
          : console.error("couldnt find instance for " + o.name),
          a++;
      }),
      1 == ColorSlots.activeSlot)
    ) {
      const a = s[0];
      (o.materials[a] = this.material),
        (o.color1 = this.entity.name),
        (t.localOutfit.selection[o.itemCat].color1 = this.entity.name);
      let n = i.render.meshInstances[a];
      n
        ? (n.material = this.material.resource)
        : console.error(
            "Slot 1 error in station " +
              e.name +
              " couldnt find meshInstance for active item: " +
              o.entity.name
          );
    } else if (2 == ColorSlots.activeSlot) {
      const a = s[1];
      (o.materials[a] = this.material),
        (o.color2 = this.entity.name),
        (t.localOutfit.selection[o.itemCat].color2 = this.entity.name);
      let n = i.render.meshInstances[a];
      n
        ? (n.material = this.material.resource)
        : console.error(
            "Slot 2 error in station " +
              e.name +
              " couldnt find meshInstance for active item: " +
              o.entity.name
          );
    } else if (3 == ColorSlots.activeSlot) {
      const a = s[2];
      (o.materials[a] = this.material),
        (o.color3 = this.entity.name),
        (t.localOutfit.selection[o.itemCat].color3 = this.entity.name);
      let n = i.render.meshInstances[a];
      n
        ? (n.material = this.material.resource)
        : console.error(
            "Slot 3 error in station " +
              e.name +
              " couldnt find meshInstance for active item: " +
              o.entity.name
          );
    }
    this.app.saveStats("player", this.app.globals.localOutfit.selection),
      (this.app.globals.outfitWasChanged = !0);
  }),
  (ColorButton.prototype.readyActiveItem = function (t, e, i) {
    let o;
    if (null == t.activeItem) {
      let i = this.app.itemDb.getCategory(
        e.script.station.itemCategory
      ).children;
      for (let e = 0; e < i.length; e++) {
        let s = i[e];
        if (
          0 == s.script.dbItem.isNoneItem &&
          0 == s.script.dbItem.isPremium &&
          0 == s.script.dbItem.isVIP &&
          0 === s.script.dbItem.redeemCode.length &&
          !1 === s.script.dbItem.isPrize
        ) {
          (o = s.script.dbItem), (t.activeItem = o.entity.name);
          break;
        }
      }
      t.ui.findByName(o.entity.name).script.fashionItem.setFashionItem();
    } else if (0 == i.enabled) {
      "robe" == t.activeItem && (t.activeItem = "halterRed"),
        (o = this.app.itemDb.getItem(t.activeItem)),
        t.localOutfit.selection.isWearingDress
          ? ((t.localPlayer.findByName("dressSlot").enabled = !1),
            (t.localPlayer.findByName("topSlot").enabled = !0),
            (t.localPlayer.findByName("bottomSlot").enabled = !0))
          : ((t.localPlayer.findByName("dressSlot").enabled = !0),
            (t.localPlayer.findByName("topSlot").enabled = !1),
            (t.localPlayer.findByName("bottomSlot").enabled = !1)),
        t.ui.findByName(o.entity.name).script.fashionItem.setFashionItem();
    } else if (((o = this.app.itemDb.getItem(t.activeItem)), o.isNoneItem)) {
      let e = o.entity.parent.children;
      for (let i = 0; i < e.length; i++) {
        const s = e[i].script.dbItem;
        if (
          !1 === s.isNoneItem &&
          !1 === s.isPremium &&
          !1 === s.isVIP &&
          0 === s.redeemCode.length &&
          s.collectibleCost <= 0 &&
          !1 === s.isPrize
        ) {
          (o = s), (t.activeItem = o.entity.name);
          break;
        }
      }
      t.ui.findByName(o.entity.name).script.fashionItem.setFashionItem();
    }
    return o;
  }),
  (ColorButton.prototype.setColorSelectedState = function (t) {
    const e = this.unselectedSprite;
    0 == this.hasCustomSprite &&
      (this.entity.name == t
        ? (this.entity.element.spriteAsset = this.selectedSprite)
        : (this.entity.element.spriteAsset = e));
  }),
  (ColorButton.prototype.colorButtonPulse = function () {
    this.pulseCountdownS = pulseTime;
  }),
  (ColorButton.prototype.setEnvironmentColor = function () {
    try {
      let t = this.app.globals.ui.findByName(this.app.globals.activeItem);
      null == t && (t = this.app.environmentColorSystem.items[0]);
      let e = this.material.resource.diffuseMapOffset;
      t.script.environmentItem.material.resource.diffuseMapOffset.set(e.x, e.y),
        t.script.environmentItem.material.resource.update(),
        (this.app.globals.env[t.name] = this.entity.name),
        this.app.saveStats("env", this.app.globals.env),
        !1 === this.app.tracking.hasSetEnvironmentColor &&
          (this.app.fire("watcher:track", "player_set_environment_color"),
          (this.app.tracking.hasSetEnvironmentColor = !0));
    } catch (t) {
      console.error("Failed to update environment color");
    }
  });
var BodyColors = pc.createScript("bodyColors");
BodyColors.attributes.add("category", {
  type: "string",
  enum: [
    { Hair: "hair" },
    { Skin: "skin" },
    { Eye: "eye" },
    { Lips: "lip" },
    { Blush: "blush" },
  ],
}),
  BodyColors.attributes.add("mainColorHex", { type: "string" }),
  BodyColors.attributes.add("shadingColorHex", { type: "string" }),
  BodyColors.attributes.add("eyebrowColorHex", { type: "string" }),
  BodyColors.attributes.add("isPremium", { type: "boolean" }),
  BodyColors.attributes.add("selectedSprite", { type: "asset" }),
  BodyColors.attributes.add("unselectedSprite", { type: "asset" }),
  (BodyColors.prototype.initialize = function () {
    this.entity.button.on(
      "click",
      function () {
        this.buttonPulse(),
          this.entity.script.bodyColors.isPremium
            ? this.premiumColorClicked()
            : (this.updateBodyColors(), this.app.fire("bodyColors:colorClick"));
      },
      this
    ),
      this.app.on(
        "setPremiumInactive",
        function () {
          this.isPremium && this.setPremiumInactive();
        },
        this
      ),
      this.app.on(
        "setPremiumActive",
        function () {
          this.isPremium && this.setPremiumActive();
        },
        this
      );
  }),
  (BodyColors.prototype.update = function (e) {
    if (this.pulseCountdownS > 0) {
      this.pulseCountdownS -= e;
      let t = 1 - this.pulseCountdownS / pulseTime,
        o = pulseScaleCurve.value(t);
      this.entity.setLocalScale(o, o, o);
    }
  }),
  (BodyColors.prototype.premiumColorClicked = function () {
    let e = !0;
    "competition" == this.app.instance.name &&
      (e = !!this.app.competition.isAdWatchable()),
      e
        ? (this.app.fire(
            "watcher:track",
            "start_rewarded_color_" + this.entity.name
          ),
          this.app.fire(
            "poki:rewardedBreak:play",
            function () {
              (this.entity.script.bodyColors.isPremium = !1),
                (this.entity.findByName("adIcon").enabled = !1),
                this.updateBodyColors(),
                this.app.fire("bodyColors:colorClick"),
                this.app.fire(
                  "watcher:track",
                  "finish_rewarded_color" + this.entity.name
                ),
                this.app.globals.unlockedBodyColors.push(this.entity.name),
                this.app.saveStats(
                  "unlockedBodyColors",
                  this.app.globals.unlockedBodyColors
                );
            }.bind(this),
            function () {}.bind(this)
          ))
        : this.app.fire("setPremiumInactive");
  }),
  (BodyColors.prototype.setPremiumInactive = function () {
    this.entity.element.opacity = 0.2;
  }),
  (BodyColors.prototype.setPremiumActive = function () {
    this.entity.element.opacity = 1;
  }),
  (BodyColors.prototype.updateBodyColors = function () {
    const e = this.app.globals.localPlayer.script.materialTracker,
      t = this.app.globals.localOutfit,
      o = this.unselectedSprite;
    switch (this.entity.script.bodyColors.category) {
      case "hair":
        let i = this.mainColorHex,
          s = new pc.Color().fromString(i);
        e.hairMaterial.diffuse.set(s.r, s.g, s.b),
          e.hairMaterial.update(),
          (t.selection.hair.selectedHairColor = s);
        let r = this.shadingColorHex,
          l = new pc.Color().fromString(r);
        e.hairShadingMaterial.diffuse.set(l.r, l.g, l.b),
          e.hairShadingMaterial.update(),
          (t.selection.hair.selectedHairShadingColor = l);
        let a = this.eyebrowColorHex,
          n = new pc.Color().fromString(a);
        e.eyebrowMaterial.diffuse.set(n.r, n.g, n.b),
          e.eyebrowMaterial.update(),
          (t.selection.hair.selectedEyebrowColor = n),
          this.app.colorDb.hairColorItems.forEach(function (e) {
            e.element.spriteAsset = o;
          });
        break;
      case "skin":
        let p = this.mainColorHex,
          c = new pc.Color().fromString(p);
        e.skinMaterial.diffuse.set(c.r, c.g, c.b),
          e.skinMaterial.update(),
          (t.selection.body.selectedSkinColor = c);
        let d = this.shadingColorHex,
          h = new pc.Color().fromString(d);
        e.skinShadingMaterial.diffuse.set(h.r, h.g, h.b),
          e.skinShadingMaterial.update(),
          (t.selection.body.selectedSkinShadingColor = h),
          this.app.colorDb.skinColorItems.forEach(function (e) {
            e.element.spriteAsset = o;
          });
        break;
      case "eye":
        let u = this.mainColorHex,
          y = new pc.Color().fromString(u);
        e.eyeMaterial.diffuse.set(y.r, y.g, y.b),
          e.eyeMaterial.update(),
          (t.selection.body.selectedEyeColor = y),
          this.app.colorDb.eyeColorItems.forEach(function (e) {
            e.element.spriteAsset = o;
          });
        break;
      case "lip":
        let C = this.mainColorHex,
          m = new pc.Color().fromString(C);
        e.lipMaterial.diffuse.set(m.r, m.g, m.b),
          e.lipMaterial.update(),
          (t.selection.body.selectedLipColor = m),
          this.app.colorDb.lipColorItems.forEach(function (e) {
            e.element.spriteAsset = o;
          });
        break;
      case "blush":
        let b = this.mainColorHex,
          f = new pc.Color().fromString(b);
        e.blushMaterial.diffuse.set(f.r, f.g, f.b),
          e.blushMaterial.update(),
          (t.selection.body.selectedBlushColor = f),
          this.app.colorDb.blushColorItems.forEach(function (e) {
            e.element.spriteAsset = o;
          });
    }
    (this.entity.element.spriteAsset = this.selectedSprite),
      this.app.saveStats("player", t.selection),
      (this.app.globals.outfitWasChanged = !0);
  }),
  (BodyColors.prototype.buttonPulse = function () {
    this.pulseCountdownS = pulseTime;
  });
var Screenshot = pc.createScript("screenshot");
Screenshot.attributes.add("cameraEntity", { type: "entity" }),
  Screenshot.attributes.add("html", { type: "asset", assetType: "html" }),
  Screenshot.attributes.add("screenLock", { type: "entity" }),
  (Screenshot.prototype.initialize = function () {
    this.createNewRenderTexture(),
      this.app.graphicsDevice.on(
        "resizecanvas",
        function (e, A) {
          this.secsSinceSameSize = 0;
        },
        this
      );
    var e = this.app.graphicsDevice;
    (this.lastWidth = e.width),
      (this.lastHeight = e.height),
      (this.secsSinceSameSize = 0),
      (this.triggerScreenshot = !1);
    var onTakeScreenshot = function () {
      (this.triggerScreenshot = !0), (this.cameraEntity.enabled = !0);
    };
    this.app.on("fabUi:takeScreenshot", onTakeScreenshot, this),
      this.app.on("postrender", this.postRender, this),
      this.screenLock.element.on(
        "click",
        () => {
          window.closePhotoModal();
        },
        this
      ),
      this.app.on(
        "closeModal",
        () => {
          this.screenLock.enabled = !1;
        },
        this
      ),
      (this.cameraEntity.enabled = !1),
      (this.cameraEntity.camera.priority = -1);
    var A = document.createElement("a");
    (A.id = "vortellasLink"), window.document.body.appendChild(A);
    var t = document.createElement("style");
    document.head.appendChild(t),
      (t.innerHTML =
        "@keyframes fadein{ 0%{opacity: 0; transform: scale(0.3);} 16%{transform: scale(1.3);} 28%{transform: scale(0.87);} 44%{transform: scale(1.05);} 59%{transform: scale(0.98);} 73%{transform: scale(1.01);} 90%{transform: scale(1);} 100%{opacity:1; transform: scale(1)}} .fadein-anim{animation: fadein 1s ease forwards}"),
      (this.div = document.createElement("div")),
      (this.div.id = "containerInit"),
      this.div.setAttribute("style", "display:none; opacity:0;"),
      (this.div.innerHTML = this.html.resource || ""),
      document.body.appendChild(this.div),
      this.bindHtml(),
      (this.isFirefoxOniOS = function () {
        return (
          /iPhone|iPad|iPod/.test(navigator.userAgent) &&
          /FxiOS/.test(navigator.userAgent)
        );
      }),
      this.isFirefoxOniOS() &&
        document
          .getElementById("downloadButton")
          .setAttribute("style", "display:none;"),
      this.on(
        "destroy",
        function () {
          this.app.off("fabUi:takeScreenshot", onTakeScreenshot, this),
            this.app.off("postrender", this.postRender, this),
            window.document.body.removeChild(A),
            this.renderTarget &&
              (this.renderTarget.destroy(), (this.renderTarget = null)),
            this.colorTexture &&
              (this.colorTexture.destroy(), (this.colorTexture = null)),
            this.depthTexture &&
              (this.depthTexture.destroy(), (this.depthTexture = null)),
            (this.canvas = null),
            (this.context = null);
        },
        this
      );
  }),
  (Screenshot.prototype.update = function (e) {
    if ("pose" == this.app.globals.activeStation) {
      var A = this.app.graphicsDevice;
      A.width == this.lastWidth &&
        A.height == this.lastHeight &&
        (this.secsSinceSameSize += e),
        this.secsSinceSameSize > 0.25 &&
          ((this.unScaledTextureWidth == A.width &&
            this.unScaledTextureHeight == A.height) ||
            this.createNewRenderTexture()),
        (this.lastWidth = A.width),
        (this.lastHeight = A.height);
    }
  }),
  (Screenshot.prototype.bindHtml = function () {
    var e = document.getElementById("downloadButton"),
      A = document.getElementById("closeButton"),
      t = 0;
    e &&
      e.addEventListener("click", function () {
        document.getElementById("vortellasLink").click(),
          t++,
          pc.app.fire("watcher:track", "photo_downloads_" + t);
      }),
      (window.closePhotoModal = function () {
        var e = document.getElementById("containerInit");
        e.classList.remove("fadein-anim"),
          e.setAttribute("style", "display:none;"),
          pc.app.fire("closeModal");
      }),
      A && A.addEventListener("click", window.closePhotoModal),
      document.addEventListener("keydown", function (e) {
        "Escape" === e.key && window.closePhotoModal();
      });
  }),
  (Screenshot.prototype.postRender = function () {
    this.triggerScreenshot &&
      (this.takeScreenshot("Vortellas-Dress-Up"),
      (this.triggerScreenshot = !1),
      (this.cameraEntity.enabled = !1));
  }),
  (Screenshot.prototype.createNewRenderTexture = function () {
    var e = this.app.graphicsDevice;
    if (this.colorTexture && this.depthTexture && this.renderTarget) {
      var A = this.renderTarget,
        t = this.colorTexture,
        v = this.depthTexture;
      (this.renderTarget = null),
        (this.colorTexture = null),
        (this.depthTexture = null),
        A.destroy(),
        t.destroy(),
        v.destroy();
    }
    var f = new pc.Texture(e, {
        width: e.height,
        height: e.height,
        format: pc.PIXELFORMAT_R8_G8_B8_A8,
        autoMipmap: !0,
        premultiplyAlpha: !1,
      }),
      P = new pc.Texture(e, {
        format: pc.PIXELFORMAT_DEPTHSTENCIL,
        width: e.height,
        height: e.height,
        mipmaps: !1,
        addressU: pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: pc.ADDRESS_CLAMP_TO_EDGE,
      });
    (f.minFilter = pc.FILTER_LINEAR), (f.magFilter = pc.FILTER_LINEAR);
    var i = new pc.RenderTarget({ colorBuffer: f, depthBuffer: P, samples: 4 });
    (this.watermark = new Image()),
      (this.watermark.src =
        "data:image/png;base64,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"),
      (this.cameraEntity.camera.renderTarget = i),
      (this.unScaledTextureWidth = e.width),
      (this.unScaledTextureHeight = e.height),
      (this.colorTexture = f),
      (this.depthTexture = P),
      (this.renderTarget = i);
    var c = this.renderTarget.colorBuffer;
    this.canvas ||
      ((this.canvas = window.document.createElement("canvas")),
      (this.context = this.canvas.getContext("2d"))),
      (this.watermarkHeight = Math.floor(f.height / 8)),
      (this.canvas.width = c.width),
      (this.canvas.height = c.height + this.watermarkHeight),
      (this.context.globalCompositeOperation = "source-over"),
      this.context.setTransform(1, 0, 0, 1, 0, 0),
      this.context.scale(1, -1),
      this.context.translate(0, -this.canvas.height),
      (this.pixels = new Uint8Array(f.width * f.height * 4));
  }),
  (Screenshot.prototype.takeScreenshot = function (e) {
    var A = this.renderTarget.colorBuffer,
      t = this.renderTarget.depthBuffer;
    this.context.save(),
      this.context.setTransform(1, 0, 0, 1, 0, 0),
      this.context.clearRect(0, 0, A.width, A.height),
      this.context.restore();
    var v = this.app.graphicsDevice.gl,
      f = this.app.graphicsDevice.gl.createFramebuffer(),
      P = this.pixels,
      i = A.impl ? A.impl._glTexture : A._glTexture,
      c = t.impl ? t.impl._glTexture : t._glTexture;
    v.bindFramebuffer(v.FRAMEBUFFER, f),
      v.framebufferTexture2D(
        v.FRAMEBUFFER,
        v.COLOR_ATTACHMENT0,
        v.TEXTURE_2D,
        i,
        0
      ),
      v.framebufferTexture2D(
        v.FRAMEBUFFER,
        v.DEPTH_STENCIL_ATTACHMENT,
        v.TEXTURE_2D,
        c,
        0
      ),
      v.readPixels(0, 0, A.width, A.height, v.RGBA, v.UNSIGNED_BYTE, P),
      v.deleteFramebuffer(f),
      (this.canvas.willReadFrequently = !0);
    this.context.createImageData(A.width, A.height).data;
    var s = this.context.getImageData(0, 0, A.width, A.height);
    s.data.set(new Uint8ClampedArray(P)),
      this.context.putImageData(s, 0, 0),
      this.context.drawImage(this.canvas, 0, this.watermarkHeight),
      this.context.drawImage(
        this.watermark,
        0,
        0,
        2048,
        256,
        0,
        0,
        A.height,
        this.watermarkHeight
      );
    this.canvas.toDataURL("image/png");
    var h = this.canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream"),
      D = document.getElementById("vortellasLink");
    D.setAttribute("download", e + ".png"),
      D.setAttribute("href", h),
      document.getElementById("screenshot").setAttribute("src", h),
      this.fadeInScreenshot();
  }),
  (Screenshot.prototype.fadeInScreenshot = function () {
    this.div.setAttribute("style", ""),
      this.div.classList.add("fadein-anim"),
      (this.screenLock.enabled = !0),
      this.screenLock.script.fade.fadeIn();
  });
var Responsive = pc.createScript("responsive");
Responsive.attributes.add("jumpButton", { type: "entity" }),
  Responsive.attributes.add("colorSlotGroup", { type: "entity" }),
  Responsive.attributes.add("emotePanel", { type: "entity" }),
  Responsive.attributes.add("compHudLabelBg", { type: "entity" }),
  Responsive.attributes.add("compVoteUi", { type: "entity" }),
  Responsive.attributes.add("starUiGroup", { type: "entity" }),
  Responsive.attributes.add("inventoryScreen", { type: "entity" }),
  (Responsive.prototype.postInitialize = function () {
    (this.responsiveItems = this.entity.findScripts("responsiveItem")),
      (this.panels = this.entity.findByTag("panel")),
      (this.responsiveContents = this.entity.findByTag("responsiveContent")),
      (this.colorContents = this.entity.findByTag("colorContent")),
      (this.directionSwapScrollViews = this.entity.findByTag(
        "directionSwapScrollView"
      )),
      (this.fashionItems = this.entity.findByTag("fashionItem")),
      (this.bodyColorButtons = this.entity.findByTag("bodyColor")),
      (this.itemColorButtons = this.entity.findByTag("itemColor")),
      (this.svAnchors = {
        portrait: {
          oneA: [0, 0.56, 1, 1],
          oneB: [0, 0, 1, 0.43],
          twoA: [0, 0.5, 1, 1],
          twoB: [0, 0, 1, 0.5],
          three: [0, 0, 1, 1],
        },
        landscapeMobile: {
          oneA: [0, 0.56, 1, 1],
          oneB: [0, 0, 1, 0.43],
          twoA: [0, 0.5, 1, 1],
          twoB: [0, 0, 1, 0.5],
          three: [0, 0, 1, 1],
        },
        landscape: {
          oneA: [0, 0.49, 1, 1],
          oneB: [0, 0, 1, 0.4],
          twoA: [0, 0.5, 1, 1],
          twoB: [0, 0, 1, 0.5],
          three: [0, 0, 1, 1],
        },
      }),
      this.app.graphicsDevice.on("resizecanvas", this.updateLayout, this),
      this.app.on("emotePanelOpen", this.updateEmotes, this),
      this.app.on(
        "compStation:enter",
        function () {
          this.slideCompHud("enter");
        },
        this
      ),
      this.app.on(
        "compStation:exit",
        function () {
          this.slideCompHud("exit");
        },
        this
      ),
      this.app.on(
        "moveVoteUi",
        function (t) {
          this.moveVoteUi(t);
        },
        this
      ),
      this.app.on(
        "updatePanelContents",
        function () {
          this.updateStationPanelContents();
        },
        this
      ),
      this.app.on("ui:inventory:open", this.moveStarCount, this),
      this.app.on("ui:inventory:close", this.moveStarCount, this),
      this.updateLayout(),
      this.showJumpButton();
  }),
  (Responsive.prototype.updateLayout = function () {
    let t = this.app.graphicsDevice;
    (this.vw = t.width / 100),
      (this.vh = t.height / 100),
      (this.ar = Math.round((this.vw / this.vh) * 100) / 100),
      pc.platform.touch
        ? ((this.app.globals.input = "touch"), (this.isTouch = !0))
        : ((this.app.globals.input = "click"), (this.isTouch = !1)),
      t.height > t.width
        ? ((this.app.globals.layout = "portrait"),
          (this.isPortrait = !0),
          this.app.fire("updateLayout", "portrait"))
        : ((this.app.globals.layout = "landscape"),
          (this.isPortrait = !1),
          this.app.fire("updateLayout", "landscape")),
      this.updateResponsiveItems(),
      this.updateStationPanels(),
      this.updateStationScrollViews(),
      this.updateStationPanelContents(),
      this.updateStationColors(),
      this.updateColorSlots(),
      this.updateEmotes(),
      this.app.fire("resize"),
      this.moveStarCount();
  }),
  (Responsive.prototype.updateResponsiveItems = function () {
    const t = this.app.globals.layout;
    let e;
    (e =
      "portrait" == t
        ? "portrait"
        : "landscape" == t && this.ar > 2
        ? "landscapeMobile"
        : "landscape"),
      this.responsiveItems.forEach(function (t) {
        let i = e;
        "landscapeMobile" == i &&
          0 == t.landscapeMobile.useLandscapeMobile &&
          (i = "landscape");
        let o = t[i];
        t.entity.setLocalPosition(o.position.x, o.position.y, o.position.z),
          (t.entity.element.anchor = [
            o.anchor.x,
            o.anchor.y,
            o.anchor.z,
            o.anchor.w,
          ]),
          (t.entity.element.pivot = [o.pivot.x, o.pivot.y]),
          t.textAlignment.useTextAlignment &&
            ("landscapeMobile" == i && (i = "landscape"),
            (t.entity.element.alignment = [
              t.textAlignment[i].x,
              t.textAlignment[i].y,
            ]));
      }, this);
  }),
  (Responsive.prototype.showJumpButton = function () {
    let t = this.jumpButton;
    this.isTouch ? (t.enabled = !0) : (t.enabled = !1);
  }),
  (Responsive.prototype.updateStationPanels = function () {
    let t = this.panels;
    this.isPortrait
      ? t.forEach(function (t) {
          t.element.anchor = [0, 0, 1, 0.45];
        })
      : t.forEach(function (t) {
          t.element.anchor = [0.6, 0, 1, 1];
        });
  }),
  (Responsive.prototype.updateStationScrollViews = function () {
    const t = this.svAnchors,
      e = this.directionSwapScrollViews;
    function setScrollViewAnchor(e, i) {
      e.tags.has("layout1A")
        ? (e.element.anchor = t[i].oneA)
        : e.tags.has("layout1B")
        ? (e.element.anchor = t[i].oneB)
        : e.tags.has("layout2A")
        ? (e.element.anchor = t[i].twoA)
        : e.tags.has("layout2B")
        ? (e.element.anchor = t[i].twoB)
        : e.tags.has("layout3") && (e.element.anchor = t[i].three);
    }
    function setScrollViewDirection(t, e) {
      "horizontal" == e
        ? ((t.scrollview.vertical = !1), (t.scrollview.horizontal = !0))
        : ((t.scrollview.vertical = !0), (t.scrollview.horizontal = !1)),
        (t.scrollview.scroll.x = 0),
        (t.scrollview.scroll.y = 0),
        (t.children[0].element.anchor = [0, 0, 1, 1]);
    }
    this.isPortrait
      ? e.forEach(function (t) {
          setScrollViewAnchor(t, "portrait"),
            setScrollViewDirection(t, "horizontal");
        })
      : this.ar > 2 && this.isTouch
      ? e.forEach(function (t) {
          setScrollViewAnchor(t, "landscapeMobile"),
            setScrollViewDirection(t, "horizontal");
        })
      : e.forEach(function (t) {
          setScrollViewAnchor(t, "landscape"),
            setScrollViewDirection(t, "vertical");
        });
  }),
  (Responsive.prototype.updateStationPanelContents = function () {
    let t,
      e = this.responsiveContents;
    this.isPortrait || (this.ar > 2 && this.isTouch)
      ? e.forEach(function (e) {
          e.element.height = e.parent.element.height - 2;
          let i = e.children.length,
            o = Math.ceil(i / 2) + 1;
          (t = e.element.height / 2),
            (e.element.width = o * t),
            this.setLayoutGroupDirection(e, "vertical"),
            e.children.forEach(function (e) {
              e.element && ((e.element.height = t), (e.element.width = t));
            });
        }, this)
      : e.forEach(function (e) {
          e.element.width = e.parent.element.width - 1;
          let i = e.children.length,
            o = Math.ceil(i / 4);
          (t = e.element.width / 4 - 1),
            (e.element.height = (o + 1) * t),
            this.setLayoutGroupDirection(e, "horizontal"),
            e.children.forEach(function (e) {
              e.element && ((e.element.height = t), (e.element.width = t));
            });
        }, this);
  }),
  (Responsive.prototype.updateStationColors = function () {
    const t = this.colorContents,
      e = this.entity.screen.scale;
    let i = 3;
    t.forEach(function (t) {
      const o = t.findByTag("colorContainer").length;
      if (this.isPortrait || (this.ar > 2 && this.isTouch)) {
        (t.element.height = t.parent.element.height - 1),
          (i = t.tags.has("skinContent") ? 5 : 3);
        const e = t.element.height / i - 1,
          n = 8 * e + 1,
          s = t.element.height - 1;
        t.children.forEach(function (t) {
          this.setColorContainer(t, e, n, s);
        }, this),
          (t.element.width = n * o),
          this.setLayoutGroupDirection(t, "horizontal");
      } else {
        t.element.width = (40 * this.vw) / e - 2;
        const n = t.element.width / 8 - 1,
          s = i * n + 1,
          a = t.element.width - 1;
        t.children.forEach(function (t) {
          this.setColorContainer(t, n, a, s);
        }, this),
          (t.element.height = s * o),
          this.setLayoutGroupDirection(t, "vertical");
      }
    }, this);
  }),
  (Responsive.prototype.updateColorSlots = function () {
    const t = this.colorSlotGroup;
    this.isPortrait || (this.ar > 2 && this.isTouch)
      ? (t.element.anchor = [0, 0.43, 1, 0.56])
      : (t.element.anchor = [0, 0.4, 1, 0.49]);
  }),
  (Responsive.prototype.setLayoutGroupDirection = function (t, e) {
    (t.layoutgroup.orientation = "horizontal" == e ? 0 : 1),
      (t.layoutgroup.alignment.x = 0),
      (t.layoutgroup.alignment.y = 1),
      t.setLocalPosition(0, 0, 0);
  }),
  (Responsive.prototype.setColorContainer = function (t, e, i, o) {
    t.element &&
      (t.tags.has("horizontal")
        ? this.setLayoutGroupDirection(t, "horizontal")
        : this.setLayoutGroupDirection(t, "vertical"),
      (t.element.height = o),
      (t.element.width = i),
      t.children.forEach(function (t) {
        t.element && ((t.element.height = e), (t.element.width = e));
      }));
  }),
  (Responsive.prototype.updateEmotes = function () {
    const t = this.emotePanel,
      e = t.findByName("emotesCloseButton"),
      i = t.findByName("toggleGroup"),
      o = t.findByName("emoteScrollView"),
      n = t.findByName("emojiScrollView"),
      s = t.findByName("flagsScrollView"),
      a = o.findByName("emoteContent"),
      l = n.findByName("emojiContent"),
      h = s.findByName("flagsContent");
    let r, c, p;
    function resizeScrollview(t, e) {
      const i = t.children[0];
      (t.element.anchor = e),
        (i.element.anchor = [0, 0, 1, 1]),
        (i.children[0].element.width = i.element.width - 5);
    }
    function resizeListItems(t, e) {
      let i = t.element.width / e - 1,
        o = Math.ceil(t.children.length / e);
      (t.element.height = i * (o + 1)),
        t.children.forEach(function (t) {
          t.element && ((t.element.height = i), (t.element.width = i));
        });
    }
    this.isPortrait
      ? ((t.element.anchor = [0, 0, 1, 0.3]),
        (e.element.anchor = [1, 1, 1, 1]),
        (e.element.pivot = [1, 0]),
        (i.element.anchor = [0, 0.85, 1, 1]),
        (p = [0, 0, 1, 0.85]),
        (r = 4),
        (c = 6))
      : ((t.element.anchor = [0.75, 0, 1, 1]),
        (e.element.anchor = [0, 1, 0, 1]),
        (e.element.pivot = [1, 1]),
        (i.element.anchor = [0, 0.9, 1, 1]),
        (p = [0, 0, 1, 0.9]),
        (r = 3),
        (c = 5)),
      resizeScrollview(o, p),
      resizeScrollview(n, p),
      resizeScrollview(s, p),
      resizeListItems(a, r),
      resizeListItems(l, c),
      resizeListItems(h, c);
  }),
  (Responsive.prototype.slideCompHud = function (t) {
    "landscape" == this.app.globals.layout &&
      ("enter" == t && "competition" == this.app.instance.name
        ? (this.compHudLabelBg.element.anchor = [0.1, 0.88, 0.5, 1])
        : (this.compHudLabelBg.element.anchor = [0.25, 0.9, 0.75, 1]));
  }),
  (Responsive.prototype.moveVoteUi = function (t) {
    let e = new pc.Vec3(0, 8, 0);
    "portrait" == this.app.globals.layout && 1 == t
      ? ((e.x = 0), (e.y = 460))
      : "portrait" == this.app.globals.layout && 0 == t
      ? ((e.x = 0), (e.y = 8))
      : "landscape" == this.app.globals.layout && 1 == t
      ? ((e.x = 200), (e.y = 8))
      : ((e.x = 0), (e.y = 8)),
      this.compVoteUi.setLocalPosition(e.x, e.y, 0);
  }),
  (Responsive.prototype.moveStarCount = function () {
    const t = this.starUiGroup,
      e = this.inventoryScreen;
    this.isPortrait
      ? (t.setLocalPosition(-2, -2, 0),
        (t.element.anchor = [1, 1, 1, 1]),
        (t.element.pivot = [1, 1]))
      : e.script.screen.isOpen()
      ? (t.setLocalPosition(-105, -2, 0),
        (t.element.anchor = [0.64, 0, 0.64, 0]),
        (t.element.pivot = [1, 0]))
      : (t.setLocalPosition(-105, -5, 0),
        (t.element.anchor = [1, 1, 1, 1]),
        (t.element.pivot = [1, 1]));
  });
var Pulse = pc.createScript("pulse");
Pulse.attributes.add("pulseTime", { type: "number", default: 1.5 }),
  Pulse.attributes.add("pulseScaleCurve", {
    type: "curve",
    default: { keys: [0, 1, 0.5, 1.2, 1, 1] },
  }),
  Pulse.attributes.add("autoPlay", { type: "boolean", default: !0 }),
  Pulse.attributes.add("continuous", { type: "boolean", default: !0 }),
  Pulse.attributes.add("axis", {
    type: "string",
    enum: [{ All: "all" }, { X: "x" }, { Y: "y" }, { Z: "z" }],
    default: "all",
  }),
  (Pulse.prototype.initialize = function () {
    window.setVDynamic(this.entity, !0),
      (this._startScale = this.entity.getLocalScale().clone()),
      (this._currentScale = this._startScale.clone()),
      (this._firedFinished = !1),
      this.autoPlay && this.start();
  }),
  (Pulse.prototype.update = function (t) {
    let e = this._pulseCountdownS;
    if (e > 0 && FrameTracker.num % 2 == 0) {
      e -= t;
      let s = 1 - e / this.pulseTime,
        i = this.pulseScaleCurve.value(s);
      const l = this.axis;
      "all" == l
        ? (this._currentScale.copy(this._startScale).mulScalar(i),
          this.entity.setLocalScale(this._currentScale))
        : (this._currentScale.copy(this._startScale),
          (this._currentScale[l] = this._startScale[l] * i),
          this.entity.setLocalScale(this._currentScale)),
        e <= 0 && this.continuous
          ? (e = this.pulseTime)
          : e <= 0 &&
            !this._firedFinished &&
            (this.fire("pulse:finished"), (this._firedFinished = !0)),
        (this._pulseCountdownS = e);
    }
  }),
  (Pulse.prototype.isPulsing = function () {
    return this._pulseCountdownS > 0;
  }),
  (Pulse.prototype.start = function () {
    (this._pulseCountdownS = this.pulseTime), (this._firedFinished = !1);
  }),
  (Pulse.prototype.stop = function () {
    this._pulseCountdownS = 0;
    let t = this.pulseScaleCurve.value(0);
    this.entity.setLocalScale(t, t, t);
  });
var Shake = pc.createScript("shake");
Shake.attributes.add("shakeTime", { type: "number", default: 1.5 }),
  Shake.attributes.add("shakeRotationCurve", { type: "curve" }),
  Shake.attributes.add("autoPlay", { type: "boolean", default: !0 }),
  Shake.attributes.add("continuous", { type: "boolean", default: !0 }),
  (Shake.prototype.postInitialize = function () {
    this.autoPlay && this.start();
  }),
  (Shake.prototype.update = function (t) {
    if (this._shakeCountdownS > 0) {
      this._shakeCountdownS -= t;
      let e = 1 - this._shakeCountdownS / this.shakeTime,
        a = this.shakeRotationCurve.value(e);
      this.entity.setLocalEulerAngles(0, 0, a),
        this._shakeCountdownS <= 0 &&
          this.continuous &&
          (this._shakeCountdownS = this.shakeTime);
    }
  }),
  (Shake.prototype.start = function () {
    this._shakeCountdownS = this.shakeTime;
  }),
  (Shake.prototype.stop = function () {
    (this._shakeCountdownS = 0), this.entity.setLocalEulerAngles(0, 0, 0);
  });
var Sound = pc.createScript("sound");
Sound.prototype.initialize = function () {
  this.app.on(
    "sound:pop:pitch1",
    function () {
      this.app.globals.isSoundOn && this.entity.sound.play("chimes_p_1");
    },
    this
  ),
    this.app.on(
      "sound:pop:pitch0.5",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("chimes_p_0.5");
      },
      this
    ),
    this.app.on(
      "sound:pop:pitch1.5",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("chimes_p_1.5");
      },
      this
    ),
    this.app.on(
      "fashionItem:itemClick",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("chimes_p_1");
      },
      this
    ),
    this.app.on(
      "colorButton:colorUpdate",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("chimes_p_1.5");
      },
      this
    ),
    this.app.on(
      "bodyColors:colorClick",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("chimes_p_1.5");
      },
      this
    ),
    this.app.on(
      "longChimes",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("longChimes");
      },
      this
    ),
    this.app.on(
      "upwardTone",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("upwardTone");
      },
      this
    ),
    this.app.on(
      "teleportSound",
      function () {
        this.app.globals.isSoundOn && this.entity.sound.play("teleport");
      },
      this
    );
};
var Sparkles = pc.createScript("sparkles");
(Sparkles.prototype.initialize = function () {
  this.app.on(
    "fashionItem:itemClick",
    function () {
      this.quickSparkles("fashionItem");
    },
    this
  ),
    this.app.on(
      "getStar",
      function () {
        this.quickSparkles("star");
      },
      this
    ),
    this.app.on(
      "colorButton:colorUpdate",
      function () {
        null != this.app.globals.activeItem &&
          this.quickSparkles("colorButton");
      },
      this
    ),
    this.app.on(
      "bodyColors:colorClick",
      function () {
        this.quickSparkles("bodyColors");
      },
      this
    ),
    this.app.on(
      "makeupItem:click",
      function () {
        this.quickSparkles("makeupItem");
      },
      this
    ),
    this.app.on("resetOutfitSparkles", this.resetOutfitSparkles, this);
}),
  (Sparkles.prototype.quickSparkles = function (t) {
    if ("bodyColors" == t || "star" == t)
      this.entity.setLocalPosition(0, 2.1, 0);
    else if ("fashionItem" == t || "colorButton" == t) {
      let t = this.app.globals.activeStation;
      "hair" == t || "hats" == t || "glasses" == t
        ? this.entity.setLocalPosition(0, 2.2, 0)
        : "shoes" == t
        ? this.entity.setLocalPosition(0, 0.6, 0)
        : "tops" == t ||
          "dresses" == t ||
          "bags" == t ||
          "belts" == t ||
          "coats" == t
        ? this.entity.setLocalPosition(0, 1.57, 0)
        : "Bottoms" == t && this.entity.setLocalPosition(0, 1.1, 0.2);
    } else "makeupItem" == t && this.entity.setLocalPosition(0, 2, 0);
    this.entity.particlesystem &&
      (this.entity.particlesystem.play(),
      setTimeout(
        function () {
          this.entity.particlesystem.stop();
        }.bind(this),
        100
      ));
  }),
  (Sparkles.prototype.continuedSparkles = function () {
    this.entity.setLocalPosition(0, 2.2, -1), this.entity.particlesystem.play();
  }),
  (Sparkles.prototype.stopSparkles = function () {
    this.entity.particlesystem.stop();
  }),
  (Sparkles.prototype.startSparkles = function () {
    this.entity.particlesystem.play();
  }),
  (Sparkles.prototype.resetOutfitSparkles = function () {
    this.entity.particlesystem &&
      (this.entity.setLocalPosition(0, 1.5, 0.8),
      this.entity.particlesystem.play(),
      setTimeout(
        function () {
          this.entity.particlesystem.stop();
        }.bind(this),
        300
      ));
  });
pc.script.createLoadingScreen(function (t) {
  var a, b;
  (a = [
    "body, html {",
    "    height: 100%;",
    "   background: linear-gradient(330deg, #FF8E90 20.87%, #FFC383 86.9%);",
    "   background-size: 100% 100%;",
    "   height: 100vh;",
    "}",
    "@keyframes pulse{",
    "   from {transform: scale(0.9);}",
    "   to {transform: scale(1);}",
    "}",
    "#application-splash-wrapper {",
    "    display: flex;",
    "    flex-direction: column;",
    "    height: 90vh;",
    "    justify-content: center;",
    "    align-items: center;",
    "}",
    "#application-game-image {",
    "    animation: pulse 2s infinite ease-in-out alternate;",
    "    z-index: 1;",
    "    pointer-events: none;",
    "    width: 80vw;",
    "    height: 50vh;",
    "    max-width: 540px;",
    "    max-height: 540px;",
    "    background-size: contain;",
    "    background-position: center;",
    "    background-repeat: no-repeat;",
    '    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbYAAAGQCAMAAAD1IrVpAAAC+lBMVEUAAAD///////////////////////////////////////////////////////////////////7////////1sgDV1dX////////WdwXiXwP8vAjtjwDwsQbriw34tgDgXQD/////0aE9PT2RUj///cH/pmAmJiZDQ0I1IxktLS3O8//M7f9KSUk0NDT/jgDky//qy//ezP9RUVHxy///lABiPSL/ywD/8frg4OCSVEPYzf//wABbW1v/7Pja2trM5//+gwDV1dT/1AL19v//9/xstP8tHRfh5P//4O//5fHV1v//6PX/2+vT8f//qmry7v/7+/7P4v/S3P//4mL/1avX7f/4fADp6v//yvrc6f/8yv/zbigeHh7/1ub6uAH2+fXu6v7uah//sZLy//+Mzf//nwXydQCd1//qZhXp6Oj/jcD9k1CUWUj/y9/nYw3NzMz/qcz6dTT/yvP/0eL/zJ7/uon/xdv/lMfscQCPRDb/v9j/rnf/uNP/31X/n83kYQX/sc//hLf/V6f/3Uf/rUP/h1P/n8X/+O7/Zaz/drH/2bb/wpr4AwPx8PD/SqL/fkT/lsDSVAH+6dRALiJoZ2f/umn/pB3+7+JPNyX/5Hf/2yy6of/ysAH/vqz/qTH8yy3/4cXyiVX/wHn/x4jk9P+Hg4H/s1h2Szzm3P91c3ViS0RtRSzHsv+UkJCYYVD8lWmrqajQwP/JxsSBaF9sXVaga1q1s7KqineIdGv/7bW/vbygn5+33v/5AoaGTzv/z+fBg1XpmVr8QJzYi1zJs6WYfmz8XFe+p5r/65B9YEjlvZSrdmC9ln2pm5KdaTmnZBKxCC/8p63/z8j3lyrRvrfrpHN3RBXo183P09r//dfyyFZ/vv/SrIbTDIKOTxK+aAnT4ujqhLP6mI/7HpXp15LrjAThzre9bn0XFxeufjCnP1jXYUHY4vb2ZtTIjR7hj32qSwjQd5j8e3i+JmzutM75Ly/rw+nMffXeQ470fhnjy+Gfh9fFn98MDAxn/BjrAAAAIHRSTlMAD/PnK9sdSztozsNbgnaMn5WnrmiYu7X+7Wkt676dauAh95AAAIKKSURBVHja7Ju7buJAFIY94xvYBhuQ1u2JxDtQpXMBgiIFLS+AhBQpEishtMIU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");',
    "}",
    "#application-game-logo {",
    "    animation: wiggle 2s ease-in-out .5s infinite;",
    "    z-index: 3;",
    "    pointer-events: none;",
    "    width: 80vw;",
    "    height: 30vh;",
    "    max-width: 540px;",
    "    max-height: 210px;",
    "    background-size: contain;",
    "    background-position: center;",
    "    background-repeat: no-repeat;",
    '    background-image: url("data:image/png;base64,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");',
    "}",
    "@keyframes wiggle {",
    "  0% { transform: rotate(0); }",
    "  10% {transform: rotate(-5deg) scale(1.05);}",
    "  20% {transform: rotate(3deg) scale(1.07);}",
    "  30% {transform: rotate(-2deg) scale(1.03);}",
    "  35% {transform: rotate(0) scale(1);}",
    "}",
    "#progress-bar-container {",
    "    position:fixed;",
    "    pointer-events: none;",
    "    bottom:8px;",
    "    left:1%;",
    "    width:98%;",
    "    z-index:2;",
    "    border-radius: 11px;",
    "    margin: 20px auto 0 auto;",
    "    height: 10%;",
    "    max-height: 40px;",
    "    background-color: #AA006F;",
    "}",
    "",
    "#progress-bar {",
    "    width: 0%;",
    "    height: 100%;",
    "    z-index:2;",
    "    border-radius: 10px;",
    "    background-color: #FFA8E7;",
    "}",
    ".stars-container {",
    "  position: absolute;",
    "  width: 100vw;",
    "  height: 100vh;",
    "  top: 0;",
    "  left: 0;",
    "}",
    ".star {",
    "  position: absolute;",
    "  cursor: pointer;",
    "  width: 0;",
    "  height: 0;",
    "  top: 50%;",
    "  left: 50%;",
    "  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));",
    "}",
    "",
    ".star-shape {",
    "  fill: #ffffff;",
    "  transition: fill 0.3s;",
    "}",
    "#stars-container > :nth-child(1){",
    "  top:50%;",
    "  left:60%;",
    "}",
    "#stars-container > :nth-child(2){",
    "  top:40%;",
    "  left:60%;",
    "}",
    "#stars-container > :nth-child(3){",
    "  top:30%;",
    "  left:50%;",
    "}",
    "#stars-container > :nth-child(4){",
    "  top:33%;",
    "  left:30%;",
    "}",
    "#stars-container > :nth-child(5){",
    "  top:50%;",
    "  left:30%;",
    "}",
    "#stars-container > :nth-child(6){",
    "  top:70%;",
    "  left:30%;",
    "}",
    "#stars-container > :nth-child(7){",
    "  top:55%;",
    "  left:50%;",
    "}",
    "#stars-container > :nth-child(8){",
    "  top:70%;",
    "  left:60%;",
    "}",
    "#stars-container > :nth-child(9){",
    "  top:60%;",
    "  left:60%;",
    "}",
    "@keyframes star-path-0 {",
    "  0%, 100% { transform: translate(-70%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-70% + 30vw), calc(-50%)) rotate(180deg); }",
    "}",
    "@keyframes star-path-1 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% + 15vw), calc(-50% - 15vw)) rotate(180deg); }",
    "}",
    "@keyframes star-path-2 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50%), calc(-50% - 20vw)) rotate(180deg); }",
    "}",
    "@keyframes star-path-3 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% - 15vw), calc(-50% - 15vw)) rotate(180deg); }",
    "}",
    "@keyframes star-path-4 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% - 20vw), calc(-50%)) rotate(180deg); }",
    "}",
    "@keyframes star-path-5 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% - 15vw), calc(-50% + 15vw)) rotate(180deg); }",
    "}",
    "@keyframes star-path-6 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50%), calc(-50% + 20vw)) rotate(180deg); }",
    "}",
    "@keyframes star-path-7 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% + 15vw), calc(-50% + 40vh)) rotate(180deg); }",
    "}",
    "@keyframes star-path-8 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% + 30vw), calc(-50% + 8vh)) rotate(180deg); }",
    "}",
    "@keyframes star-path-9 {",
    "  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }",
    "  50% { transform: translate(calc(-50% + 20vw), calc(-50% + 18vh)) rotate(180deg); }",
    "}",
    "@keyframes twinkle {",
    "  0%, 100% { opacity: 0.7; }",
    "  50% { opacity: 1; }",
    "}",
  ].join("\n")),
    ((b = document.createElement("style")).type = "text/css"),
    b.styleSheet
      ? (b.styleSheet.cssText = a)
      : b.appendChild(document.createTextNode(a)),
    document.head.appendChild(b),
    (function () {
      var t = document.createElement("div");
      (t.id = "application-splash-wrapper"), document.body.appendChild(t);
      var a = document.createElement("div");
      (a.id = "application-game-image"), t.appendChild(a);
      var b = document.createElement("div");
      (b.id = "application-game-logo"), t.appendChild(b);
      var e = document.createElement("div");
      (e.id = "progress-bar-container"), t.appendChild(e);
      var r = document.createElement("div");
      (r.id = "progress-bar"), e.appendChild(r);
      var s = document.createElement("div");
      (s.id = "stars-container"), t.appendChild(s);
      let n = document.getElementById("application-canvas");
      n && (n.style.zIndex = -1);
      const m = [
        "#EA74F5",
        "#8774F5",
        "#B974F5",
        "#74CCF5",
        " #74F5CC",
        "#ff99cc",
        "#ff80b3",
        "#ff66a3",
      ];
      function createCandySVG(t, a = "#590062", b = a, e = {}) {
        const r = "http://www.w3.org/2000/svg",
          s = document.createElementNS(r, "svg");
        s.setAttribute("width", t),
          s.setAttribute("height", t),
          s.setAttribute("viewBox", "0 0 34 34"),
          s.setAttribute("fill", "none");
        const n = document.createElementNS(r, "path");
        n.setAttribute(
          "d",
          "M12.0355 25.1617L10.6024 30.8904C10.4829 31.3685 10.2387 31.8064 9.8947 32.1593C9.55069 32.5121 9.11919 32.7674 8.64427 32.8989C8.16935 33.0305 7.66802 33.0337 7.19147 32.9081C6.71492 32.7826 6.28023 32.5328 5.93179 32.1843L1.81626 28.0706C1.49425 27.7488 1.25604 27.353 1.1225 26.9178C0.988963 26.4826 0.964159 26.0213 1.05026 25.5743C1.13637 25.1273 1.33076 24.7082 1.6164 24.3538C1.90205 23.9993 2.27024 23.7203 2.68874 23.5411L8.09629 21.2244"
        ),
          n.setAttribute("fill", "white"),
          n.setAttribute("class", "colorChange"),
          s.appendChild(n);
        const m = document.createElementNS(r, "path");
        m.setAttribute(
          "d",
          "M8.09606 15.9728L15.9726 8.09629C16.6688 7.40027 17.613 7.00926 18.5974 7.00926C19.5819 7.00926 20.5261 7.40027 21.2223 8.09629L26.4739 13.3498C27.17 14.046 27.561 14.9902 27.561 15.9746C27.561 16.9591 27.17 17.9033 26.4739 18.5995L18.5974 26.476C17.9012 27.172 16.957 27.563 15.9726 27.563C14.9881 27.563 14.0439 27.172 13.3477 26.476L8.09606 21.2207C7.40004 20.5245 7.00903 19.5803 7.00903 18.5958C7.00903 17.6113 7.40004 16.6672 8.09606 15.9709V15.9728ZM25.1615 12.0355L30.8902 10.6024C31.3683 10.4829 31.8062 10.2387 32.159 9.8947C32.5119 9.55069 32.7671 9.11919 32.8987 8.64427C33.0303 8.16935 33.0334 7.66801 32.9079 7.19147C32.7823 6.71492 32.5326 6.28023 32.1841 5.93179L28.0704 1.81626C27.7486 1.49425 27.3528 1.25604 26.9176 1.1225C26.4824 0.988963 26.0211 0.964159 25.5741 1.05026C25.1271 1.13637 24.708 1.33076 24.3535 1.6164C23.9991 1.90205 23.72 2.27024 23.5409 2.68874L21.2223 8.09629"
        ),
          m.setAttribute("fill", "white"),
          m.setAttribute("class", "colorChange"),
          s.appendChild(m);
        const i = document.createElementNS(r, "path");
        i.setAttribute(
          "d",
          "M12.0355 25.1617L10.6024 30.8904C10.4829 31.3685 10.2387 31.8064 9.8947 32.1593C9.55069 32.5121 9.11919 32.7674 8.64427 32.8989C8.16935 33.0305 7.66802 33.0337 7.19147 32.9081C6.71492 32.7826 6.28023 32.5328 5.93179 32.1843L1.81626 28.0706C1.49425 27.7488 1.25604 27.353 1.1225 26.9178C0.988963 26.4826 0.964159 26.0213 1.05026 25.5743C1.13637 25.1273 1.33076 24.7082 1.6164 24.3538C1.90205 23.9993 2.27024 23.7203 2.68874 23.5411L8.09629 21.2244M21.2223 8.09629C20.5261 7.40027 19.5819 7.00926 18.5974 7.00926C17.613 7.00926 16.6688 7.40027 15.9726 8.09629L8.09606 15.9728V15.9709C7.40004 16.6672 7.00903 17.6113 7.00903 18.5958C7.00903 19.5803 7.40004 20.5245 8.09606 21.2207L13.3477 26.476C14.0439 27.172 14.9881 27.563 15.9726 27.563C16.957 27.563 17.9012 27.172 18.5974 26.476L26.4739 18.5995C27.17 17.9033 27.561 16.9591 27.561 15.9746C27.561 14.9902 27.17 14.046 26.4739 13.3498L21.2223 8.09629ZM21.2223 8.09629L23.5409 2.68874C23.72 2.27024 23.9991 1.90205 24.3535 1.6164C24.708 1.33076 25.1271 1.13637 25.5741 1.05026C26.0211 0.964159 26.4824 0.988963 26.9176 1.1225C27.3528 1.25604 27.7486 1.49425 28.0704 1.81626L32.1841 5.93179C32.5326 6.28023 32.7823 6.71492 32.9079 7.19147C33.0334 7.66801 33.0303 8.16935 32.8987 8.64427C32.7671 9.11919 32.5119 9.55069 32.159 9.8947C31.8062 10.2387 31.3683 10.4829 30.8902 10.6024L25.1615 12.0355"
        ),
          i.setAttribute("stroke", a),
          i.setAttribute("stroke-width", "2"),
          i.setAttribute("stroke-linecap", "round"),
          i.setAttribute("stroke-linejoin", "round"),
          s.appendChild(i);
        const N = document.createElementNS(r, "line");
        N.setAttribute("x1", "14.7071"),
          N.setAttribute("y1", "9.29289"),
          N.setAttribute("x2", "24.7071"),
          N.setAttribute("y2", "19.2929"),
          N.setAttribute("stroke", a),
          N.setAttribute("stroke-width", "2"),
          s.appendChild(N);
        const o = document.createElementNS(r, "line");
        o.setAttribute("x1", "9.70711"),
          o.setAttribute("y1", "15.2929"),
          o.setAttribute("x2", "19.7071"),
          o.setAttribute("y2", "25.2929"),
          o.setAttribute("stroke", a),
          o.setAttribute("stroke-width", "2"),
          s.appendChild(o);
        const l = document.createElementNS(r, "path");
        l.setAttribute(
          "d",
          "M15.0371 9.43713L16.3 8.11942C17.4464 6.92322 19.3455 6.88286 20.5417 8.02927L26.3662 13.6114C27.5624 14.7578 27.6027 16.6569 26.4563 17.8531L25.1934 19.1708L15.0371 9.43713Z"
        ),
          l.setAttribute("fill", b),
          l.setAttribute("fill-opacity", "0.29"),
          s.appendChild(l);
        const h = document.createElementNS(r, "path");
        return (
          h.setAttribute(
            "d",
            "M19.3845 24.9084L18.099 26.204C16.932 27.3802 15.0325 27.3876 13.8564 26.2206L8.12962 20.5382C6.9535 19.3712 6.94611 17.4717 8.11312 16.2956L9.39868 15L19.3845 24.9084Z"
          ),
          h.setAttribute("fill", b),
          h.setAttribute("fill-opacity", "0.29"),
          s.appendChild(h),
          s
        );
      }
      for (let t = 0; t < 12; t++) {
        const a = document.createElement("div");
        a.classList.add("star");
        const b = createCandySVG(50, "#590062");
        a.appendChild(b),
          a.addEventListener("click", function () {
            const t = m[Math.floor(Math.random() * m.length)],
              a = this.querySelectorAll(".colorChange");
            (a[0].style.fill = t),
              (a[1].style.fill = t),
              (this.style.filter = `drop-shadow(0 0 15px ${t})`);
          }),
          (a.style.animation = `star-path-${t} ${
            12 + t
          }s infinite ease-in-out, twinkle ${3 + (t % 3)}s infinite alternate`),
          s.appendChild(a);
      }
    })(),
    t.on("preload:end", function () {
      t.off("preload:progress");
    }),
    t.on("preload:progress", function (t) {
      var a = document.getElementById("progress-bar");
      a && ((t = Math.min(1, Math.max(0, t))), (a.style.width = 100 * t + "%"));
    }),
    t.on("poki:ready", function () {
      let t = document.getElementById("application-canvas");
      t && t.style.removeProperty("z-index");
      var a = document.getElementById("application-splash-wrapper");
      a && a.parentElement.removeChild(a),
        (document.body.style.backgroundColor = "#ffc8de");
    });
});
var WatcherSystem = pc.createScript("watcherSystem");
WatcherSystem.attributes.add("endpoint", {
  type: "string",
  default: "https://watcher.v1digital.com/api/v1/activity",
}),
  WatcherSystem.attributes.add("gameName", {
    type: "string",
    description: "Only use lowercase letters and hyphens, eg vortellis_cafe",
  }),
  WatcherSystem.attributes.add("gameplayTimeInterval", {
    type: "number",
    default: 30,
    description: "Seconds between gameplay_time_s reporting events",
  }),
  WatcherSystem.attributes.add("fpsSampleInterval", {
    type: "number",
    default: 5,
    description: "Seconds between current_fps reporting events",
  }),
  (WatcherSystem.prototype.initialize = function () {
    (this._gameplayTimeCountdownS = 0),
      (this._fpsSampleCountdownS = 0),
      (this._hadFirstInteraction = !1),
      this.app.on("watcher:track", this._track, this),
      this.app.on("poki:ready", this._pokiReady, this),
      this.app.once("poki:firstInteraction", this._onFirstInteraction, this);
  }),
  (WatcherSystem.prototype.update = function (t) {
    if (
      "dev" == window.environment &&
      (this._gameplayTimeCountdownS > 0 &&
        ((this._gameplayTimeCountdownS -= t),
        this._gameplayTimeCountdownS <= 0 &&
          (this._track("gameplay_time_s", this.gameplayTimeInterval),
          (this._gameplayTimeCountdownS = this.gameplayTimeInterval))),
      this._fpsSampleCountdownS > 0 &&
        ((this._fpsSampleCountdownS -= t), this._fpsSampleCountdownS <= 0))
    ) {
      let t = parseInt(this.app.getCurrentFps());
      this._track("current_fps_" + t, 1),
        (this._fpsSampleCountdownS = this.fpsSampleInterval);
    }
  }),
  (WatcherSystem.prototype._pokiReady = function () {
    this._track("poki_ready"),
      this._track("load_time_s", Math.round(performance.now() / 1e3));
  }),
  (WatcherSystem.prototype._onFirstInteraction = function () {
    this._hadFirstInteraction ||
      ((this._gameplayTimeCountdownS = this.gameplayTimeInterval),
      (this._fpsSampleCountdownS = this.fpsSampleInterval),
      (this._hadFirstInteraction = !0),
      this._track("first_gameplay_start"));
  }),
  (WatcherSystem.prototype._track = function (t, e = 1) {
    "prod" === window.environment && this.app.pokiSystem
      ? this.app.pokiSystem.measure(t)
      : window.sendActivity({ event_name: t, value: e });
  });
var Fade = pc.createScript("fade");
Fade.attributes.add("fadeTime", { type: "number", default: 1 }),
  Fade.attributes.add("fadeInCurve", {
    type: "curve",
    default: { keys: [0, 0, 1, 1] },
  }),
  Fade.attributes.add("fadeOutCurve", {
    type: "curve",
    default: { keys: [0, 1, 1, 0] },
  }),
  (Fade.prototype.update = function (e) {
    if (this._fadeCountdownS > 0) {
      this._fadeCountdownS -= e;
      let t = 1 - this._fadeCountdownS / this.fadeTime,
        a = this.activeCurve.value(t),
        d = this.entity;
      d.element ? (d.element.opacity = a) : d.sprite && (d.sprite.opacity = a);
    }
  }),
  (Fade.prototype.fadeOut = function () {
    (this._fadeCountdownS = this.fadeTime),
      (this.activeCurve = this.fadeOutCurve);
  }),
  (Fade.prototype.fadeIn = function () {
    (this._fadeCountdownS = this.fadeTime),
      (this.activeCurve = this.fadeInCurve);
  }),
  (Fade.prototype.cancel = function () {
    this._fadeCountdownS = 0;
  });
(window.gameVersion = "v01.05.15"),
  (window.environment = "prod"),
  (window.gameName = "vortellas_dress_up"),
  (window.sendActivity = function (e) {
    if (
      "prod" !== window.environment &&
      !(window.location.href.indexOf("playcanv") > -1) &&
      ("string" == typeof e && (e = { event_name: e, value: 1 }),
      "dev" === window.environment)
    ) {
      var n = new XMLHttpRequest();
      n.open("POST", "https://watcher.v1digital.com/api/v1/activity", !0),
        n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
        (n.onreadystatechange = function () {
          n.readyState === XMLHttpRequest.DONE &&
            200 !== n.status &&
            console.error("Watcher request returned:", n.status);
        });
      const t = new URLSearchParams(e).toString(),
        o =
          "game_name=" +
          window.gameName +
          "&game_version=" +
          window.gameVersion +
          "&" +
          t;
      n.send(o);
    }
  }),
  window.sendActivity("load_start");
var CharAnims = pc.createScript("charAnims");
CharAnims.attributes.add("clientMesh", { type: "entity" }),
  CharAnims.attributes.add("openEyes", { type: "entity" }),
  CharAnims.attributes.add("happyEyes", { type: "entity" }),
  CharAnims.attributes.add("broomDismountButton", { type: "entity" }),
  CharAnims.attributes.add("customFaces", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "emoteNumber",
        type: "number",
        description: "Id number of the emote",
      },
      {
        name: "enablesThis",
        type: "entity",
        description: "Render entity to be enabled for the emote",
      },
      {
        name: "disablesThese",
        type: "entity",
        array: !0,
        description: "Render entities to be disabled for the emote",
      },
    ],
  }),
  (CharAnims.prototype.initialize = function () {
    (this._overrideEnabled = !1),
      (this.anim = this.clientMesh.anim),
      (this.sound = this.entity.sound),
      (this.playerEffectsScript = this.entity.script.playerEffects),
      this.app.afterGroupLoaded("eyeSlot", this.showEyes.bind(this)),
      this.app.on("anim:follow", this._onAnimFollow, this),
      (this._followPlayerCharAnims = null),
      (this._followPlayerClientId = 0),
      (this._followCountdownS = 0);
  }),
  (CharAnims.prototype.postInitialize = function () {
    this._linkBaseAnims(),
      this._linkBagPoses(),
      this._linkHandheldPoses(),
      this._linkVortinaPoses(),
      this.entity.isRemotePlayer &&
        "competition" == this.app.instance.name &&
        this.anim.setBoolean("isWave", !1);
  }),
  (CharAnims.prototype._linkBaseAnims = function () {
    this.app.afterGroupLoaded(
      "baseAnims",
      () => {
        if (this.entity.hasLeftGame) return;
        const e = this.anim.layers[0],
          t = this.anim.layers[4],
          s = this.app.assetLibrary.baseAnims;
        e.assignAnimation("Broom", s[0].asset.resource),
          e.assignAnimation("Strut", s[1].asset.resource),
          t.assignAnimation("Broom", s[0].asset.resource);
      },
      this
    );
  }),
  (CharAnims.prototype._linkBagPoses = function () {
    this.app.afterGroupLoaded(
      "bagPoses",
      () => {
        if (this.entity.hasLeftGame) return;
        let e = this.anim.layers[1];
        const t = this.app.assetLibrary["bag poses"];
        e.assignAnimation("Bag1Shoulder", t[0].asset.resource),
          e.assignAnimation("Bag2Elbow", t[1].asset.resource),
          e.assignAnimation("Bag3Hand", t[2].asset.resource);
      },
      this
    );
  }),
  (CharAnims.prototype._linkHandheldPoses = function () {
    this.app.afterGroupLoaded(
      "handheldPoses",
      () => {
        if (this.entity.hasLeftGame) return;
        let e = this.anim.layers[2];
        const t = this.app.assetLibrary["handheld poses"];
        e.assignAnimation("HandheldSmall", t[0].asset.resource),
          e.assignAnimation("HandheldLarge", t[1].asset.resource);
      },
      this
    );
  }),
  (CharAnims.prototype._linkVortinaPoses = function () {
    this.app.afterGroupLoaded(
      "vortinaPoses",
      () => {
        if (this.entity.hasLeftGame) return;
        let e = this.anim.layers[3];
        const t = this.app.assetLibrary["vortina poses"];
        e.assignAnimation("2leftArmOut", t[0].asset.resource),
          e.assignAnimation("3happy01", t[1].asset.resource),
          e.assignAnimation("4handsOnHips", t[2].asset.resource),
          e.assignAnimation("5crossedArms", t[3].asset.resource),
          e.assignAnimation("6happy06", t[4].asset.resource),
          e.assignAnimation("7threequartturn", t[5].asset.resource),
          e.assignAnimation("8sideviewleanback", t[6].asset.resource),
          e.assignAnimation("9sideViewFootUp", t[7].asset.resource),
          e.assignAnimation("10footOutHandonHip", t[8].asset.resource),
          e.assignAnimation("11footOutArmsOut", t[9].asset.resource),
          e.assignAnimation("12lounge", t[10].asset.resource),
          e.assignAnimation("13armUpAndHip", t[11].asset.resource),
          e.assignAnimation("14overShoulderLook", t[12].asset.resource),
          e.assignAnimation("15handsInHair", t[13].asset.resource),
          e.assignAnimation("16faceFrame", t[14].asset.resource),
          e.assignAnimation("17dance01", t[15].asset.resource),
          e.assignAnimation("18dance02", t[16].asset.resource),
          e.assignAnimation("19dance03", t[17].asset.resource),
          e.assignAnimation("20dance04", t[18].asset.resource),
          e.assignAnimation("21dance05", t[19].asset.resource),
          e.assignAnimation("22dance06", t[20].asset.resource),
          e.assignAnimation("23cry", t[21].asset.resource),
          e.assignAnimation("24angry", t[22].asset.resource),
          e.assignAnimation("25sixSeven", t[23].asset.resource);
      },
      this
    );
  }),
  (CharAnims.prototype.isOverrideEnabled = function () {
    return this._overrideEnabled;
  }),
  (CharAnims.prototype.enableOverride = function () {
    this._overrideEnabled = !0;
  }),
  (CharAnims.prototype.disableOverride = function () {
    this._overrideEnabled = !1;
  }),
  (CharAnims.prototype.isFollowingPlayer = function () {
    return null !== this._followPlayerCharAnims;
  }),
  (CharAnims.prototype.canBeFollowed = function () {
    if (this.anim) {
      const e = this.anim.getInteger("pose");
      return (
        this._followCountdownS <= 0 &&
        e > 0 &&
        !1 === this.entity.hasLeftGame &&
        12 != e
      );
    }
    return !1;
  }),
  (CharAnims.prototype.getFollowPlayerClientId = function () {
    return this._followPlayerClientId;
  }),
  (CharAnims.prototype.setSpeed = function (e) {
    this.anim.speed = e * this.playerEffectsScript.speedModifier;
  }),
  (CharAnims.prototype.setSpeedFromInputPercentage = function (e) {
    this.setSpeed(1.8 * e);
  }),
  (CharAnims.prototype.setAnimIdle = function () {
    if (this._overrideEnabled) return;
    let e = this.anim;
    const t = e.getInteger("pose");
    if (
      (e.setBoolean("isJumping", !1),
      e.setBoolean("isWave", !1),
      e.setBoolean("isWalking", !1),
      e.setBoolean("isStrutting", !1),
      (e.findAnimationLayer("Pose").weight = 0),
      0 !== t)
    ) {
      const s = this.app.emotes.getEmoteByNum(t);
      s && s.customFace && this._removeCustomFace(t),
        e.setInteger("pose", 0),
        this._updateEmoteMusic(0);
    }
  }),
  (CharAnims.prototype.setAnimInteger = function (e) {
    if (this._overrideEnabled) return;
    let t = this.anim,
      s = t.findAnimationLayer("Pose");
    const i = t.getInteger("pose");
    if (
      (e <= 0 && s.weight > 0.01
        ? (s.weight = 0)
        : e > 0 && s.weight < 0.99 && (s.weight = 1),
      i !== e)
    ) {
      const s = this.app.emotes.getEmoteByNum(i);
      s && s.customFace && this._removeCustomFace(i),
        t.setInteger("pose", e),
        this._updateEmoteMusic(e);
    }
    const n = this.app.emotes.getEmoteByNum(e);
    n && n.customFace ? this._setCustomFace(e) : this._removeCustomFace(e);
  }),
  (CharAnims.prototype.isWalking = function () {
    return this.anim.getBoolean("isWalking");
  }),
  (CharAnims.prototype.setAnimWalk = function (e) {
    this._overrideEnabled ||
      (this.anim.setBoolean("isWalking", e),
      e && this.anim.setBoolean("isWave", !1));
  }),
  (CharAnims.prototype.isStrutting = function () {
    return this.anim.getBoolean("isStrutting");
  }),
  (CharAnims.prototype.isJumping = function () {
    return this.anim.getBoolean("isJumping");
  }),
  (CharAnims.prototype.setAnimJump = function (e) {
    this._overrideEnabled || this.anim.setBoolean("isJumping", e);
  }),
  (CharAnims.prototype.setAnimWave = function (e) {
    this._overrideEnabled ||
      (this.anim.setBoolean("isWave", e),
      e &&
        (this.anim.setBoolean("isWalking", !1),
        this.anim.setBoolean("isStrutting", !1)));
  }),
  (CharAnims.prototype.playRunwayAnimations = function () {
    this._overrideEnabled || (this.setAnimIdle(), this.setAnimStrut(!0));
  }),
  (CharAnims.prototype.setAnimStrut = function (e) {
    this._overrideEnabled ||
      (this.anim.setBoolean("isWave", !1),
      this.anim.setBoolean("isStrutting", e),
      e && this.anim.setBoolean("isWalking", !1));
  }),
  (CharAnims.prototype.setBagPose = function (e) {
    this.app.afterGroupLoaded("bagPoses", () => {
      e > 0
        ? (this.anim.setInteger("bagPose", e),
          (this.anim.findAnimationLayer("Bag").weight = 1))
        : (this.anim.findAnimationLayer("Bag").weight = 0);
    });
  }),
  (CharAnims.prototype.setHandheldPose = function (e) {
    this.app.afterGroupLoaded("handheldPoses", () => {
      e > 0
        ? (this.anim.setInteger("handheldPose", e),
          (this.anim.findAnimationLayer("Handheld").weight = 1))
        : (this.anim.findAnimationLayer("Handheld").weight = 0);
    });
  }),
  (CharAnims.prototype.setPose = function (e) {
    if (this._overrideEnabled) return;
    let t = this.anim,
      s = t.getInteger("pose");
    const i = this.app.emotes.getEmoteByNum(e);
    if (
      (t.setBoolean("isWave", !1),
      t.setBoolean("isWalking", !1),
      t.setBoolean("isJumping", !1),
      (t.findAnimationLayer("Pose").weight = 1),
      s !== e)
    ) {
      const i = this.app.emotes.getEmoteByNum(s);
      i && i.customFace && this._removeCustomFace(s),
        t.setInteger("pose", e),
        this._updateEmoteMusic(e);
    }
    i && i.customFace && this._setCustomFace(e);
  }),
  (CharAnims.prototype.showEyes = function () {
    (this.openEyes.enabled = !0), (this.happyEyes.enabled = !1);
  }),
  (CharAnims.prototype._onAnimFollow = function (e) {
    !1 !== this.entity.isLocalPlayer &&
      (this.setFollowPlayer(e), this._transmitFollowPlayerClientId(e.clientId));
  }),
  (CharAnims.prototype.setFollowPlayer = function (e) {
    e &&
      e.script &&
      e.script.charAnims &&
      ((this._followPlayerCharAnims = e.script.charAnims),
      (this._followPlayerClientId = e.clientId));
  }),
  (CharAnims.prototype.clearFollowPlayer = function () {
    null !== this._followPlayerCharAnims &&
      ((this._followPlayerCharAnims = null),
      (this._followPlayerClientId = 0),
      (this._followCountdownS = 2.5),
      this.entity.isLocalPlayer &&
        this._transmitFollowPlayerClientId(this._followPlayerClientId));
  }),
  (CharAnims.prototype._transmitFollowPlayerClientId = function (e) {
    const t = [
      this.app.networkCodes.COMMUNICATION,
      [
        [
          [1, 6],
          [1, e],
        ],
      ],
    ];
    this.app.server.send(MessagePack.encode(t));
  }),
  (CharAnims.prototype.update = function (e) {
    let t = this._followPlayerCharAnims;
    if (t)
      if (
        t.entity &&
        (t.entity.hasLeftGame ||
          !1 === t.entity.enabled ||
          this._overrideEnabled)
      )
        this.setAnimInteger(0), this.clearFollowPlayer();
      else {
        let e = this.anim.findAnimationLayer("Pose");
        const s = t.anim.findAnimationLayer("Pose");
        (e.activeStateCurrentTime = s.activeStateCurrentTime),
          this.setAnimInteger(t.anim.getInteger("pose"));
      }
    this._followCountdownS > 0 && (this._followCountdownS -= e);
  }),
  (CharAnims.prototype._updateEmoteMusic = function (e) {
    if (this.entity.isRemotePlayer) return;
    const t = this.app.emotes.getEmoteByNum(e);
    t && t.music
      ? ((this.sound.slot("emoteMusic").asset = t.music),
        this.sound.play("emoteMusic"),
        this.app.fire("musicStop"))
      : (this.sound.stop("emoteMusic"), this.app.fire("musicStart"));
  }),
  (CharAnims.prototype._setCustomFace = function (e) {
    this.customFaces.forEach((t) => {
      e == t.emoteNumber &&
        ((t.enablesThis.enabled = !0),
        t.disablesThese.forEach((e) => {
          e.enabled = !1;
        }));
    });
  }),
  (CharAnims.prototype._removeCustomFace = function (e) {
    this.customFaces.forEach((t) => {
      e == t.emoteNumber &&
        ((t.enablesThis.enabled = !1),
        t.disablesThese.forEach((e) => {
          e.enabled = !0;
        }));
    });
  }),
  (CharAnims.prototype.setBroom = function (e) {
    const t = this.anim;
    if (e) {
      const e = t.getInteger("pose");
      if (
        (t.setBoolean("isBroom", !0),
        t.setBoolean("isJumping", !1),
        t.setBoolean("isWave", !1),
        t.setBoolean("isWalking", !1),
        t.setBoolean("isStrutting", !1),
        (t.findAnimationLayer("Pose").weight = 0),
        (t.findAnimationLayer("Waist Override").weight = 1),
        this.clientMesh.script.bounce.start(),
        this.entity.isLocalPlayer &&
          this.entity.script.localPlayerMovement &&
          ((this.entity.script.localPlayerMovement.speed = 2.6),
          (this.app.physics.gravity = -0.002),
          (this.broomDismountButton.enabled = !0)),
        0 !== e)
      ) {
        const s = this.app.emotes.getEmoteByNum(e);
        s && s.customFace && this._removeCustomFace(e),
          t.setInteger("pose", 0),
          this._updateEmoteMusic(0);
      }
    } else
      t.setBoolean("isBroom", !1),
        (t.findAnimationLayer("Waist Override").weight = 0),
        this.clientMesh.script.bounce.stop(),
        this.entity.isLocalPlayer &&
          this.entity.script.localPlayerMovement &&
          ((this.entity.script.localPlayerMovement.speed = 2.16),
          (this.app.physics.gravity = -0.008),
          (this.broomDismountButton.enabled = !1));
  });
var MaterialTracker = pc.createScript("materialTracker");
MaterialTracker.attributes.add("localPlayerRig", { type: "entity" }),
  MaterialTracker.attributes.add("baseHairMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseHairShadingMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseSkinMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseSkinShadingMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseEyeMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseEyebrowMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseLipMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("baseBlushMaterial", {
    type: "asset",
    assetType: "material",
  }),
  MaterialTracker.attributes.add("defaults", { type: "entity", array: !0 }),
  (MaterialTracker.prototype.initialize = function () {
    (this.hairMaterial = this.baseHairMaterial.resource.clone()),
      (this.hairShadingMaterial =
        this.baseHairShadingMaterial.resource.clone()),
      (this.skinMaterial = this.baseSkinMaterial.resource.clone()),
      (this.skinShadingMaterial =
        this.baseSkinShadingMaterial.resource.clone()),
      (this.eyeMaterial = this.baseEyeMaterial.resource.clone()),
      (this.eyebrowMaterial = this.baseEyebrowMaterial.resource.clone()),
      (this.lipMaterial = this.baseLipMaterial.resource.clone()),
      (this.blushMaterial = this.baseBlushMaterial.resource.clone()),
      this.applyMaterialsToDefaults();
  }),
  (MaterialTracker.prototype.applyMaterialsToDefaults = function () {
    this.defaults.forEach(function (a) {
      a
        ? this.applyBodyColors(a)
        : console.error("Default item not found: " + itemName);
    }, this);
  }),
  (MaterialTracker.prototype.applyBodyColors = function (a) {
    for (let e in a.render.meshInstances) {
      let t = a.render.meshInstances[e];
      t &&
        ("skin_blender" == t.material.name
          ? (t.material = this.skinMaterial)
          : "skinShading_blender" == t.material.name
          ? (t.material = this.skinShadingMaterial)
          : "eyeColor_blender" == t.material.name
          ? (t.material = this.eyeMaterial)
          : "lipColor_blender" == t.material.name &&
            (t.material = this.lipMaterial));
    }
  });
var Station = pc.createScript("station");
Station.attributes.add("enablesThese", {
  type: "json",
  array: !0,
  description: "What entities should be enabled when clicked",
  schema: [{ name: "itemToEnable", type: "entity" }],
}),
  Station.attributes.add("uiButtonGroup", { type: "entity" }),
  Station.attributes.add("itemSlot", {
    type: "entity",
    description: "Local player item category slot",
  }),
  Station.attributes.add("itemCategory", {
    type: "string",
    description:
      "The localOutfit category to be modified. Should match localOutfit.selection string",
  }),
  Station.attributes.add("isCompetition", { type: "boolean", default: !1 }),
  Station.attributes.add("isVIP", { type: "boolean", default: !1 }),
  Station.attributes.add("playerRot", {
    type: "vec3",
    description: "Player rotation to look at the camera when station is active",
  }),
  Station.attributes.add("landscape", {
    type: "json",
    schema: [
      { name: "cameraDistance", type: "number", default: 3.5 },
      { name: "cameraY", type: "number", default: 1.6 },
      { name: "cameraRot", type: "vec3" },
      { name: "cameraFov", type: "number", default: 40 },
    ],
  }),
  Station.attributes.add("portrait", {
    type: "json",
    schema: [
      { name: "cameraPos", type: "vec3" },
      { name: "cameraRot", type: "vec3" },
      { name: "cameraFov", type: "number", default: 40 },
    ],
  }),
  Station.attributes.add("icon", {
    type: "entity",
    description: "Respective station icon",
  }),
  Station.attributes.add("compLight", {
    type: "entity",
    description: "Competition light to disable when station is active",
  }),
  Station.attributes.add("eventCurrency", {
    type: "string",
    default: "",
    description:
      "(Optional) If associated with a collectible event. Must match eventPrefix in collectible.js",
  }),
  (Station.prototype.initialize = function () {
    (this.pos = new pc.Vec3()),
      this.pos.copy(this.entity.getLocalPosition()),
      (this._myPosition = this.entity.getPosition().clone()),
      (this._adjustedCameraPos = new pc.Vec3()),
      (this.posHidden = new pc.Vec3(this.pos.x, this.pos.y - 0.6, this.pos.z)),
      (this.stationVisits = 0);
  }),
  (Station.prototype.setStationActive = function () {
    let t = this.entity.name;
    if (
      (this.app.fire("station:enter", t),
      (this.app.globals.activeStation = t),
      (this.app.globals.movementAllowed = !1),
      (this.app.globals.remotePlayerGroup.enabled = !1),
      "portrait" == this.app.globals.layout && this.app.fire("chatbox:close"),
      this.app.fire("longChimes"),
      this.app.globals.localCharAnims.setAnimIdle(),
      this.app.fire("dressToggle:station:check", t),
      this.enablesThese.forEach(function (t) {
        t && t.itemToEnable && (t.itemToEnable.enabled = !0);
      }),
      this.uiButtonGroup)
    ) {
      this.uiButtonGroup.findScripts("fashionItem").forEach((t) => {
        t.isVIP && (this.isVIP ? t.setVIPActive() : t.setVIPInactive());
      });
    }
    if (this.isCompetition) {
      this.app.fire("compStation:enter");
      let t = !0;
      "competition" == this.app.instance.name &&
        (t = !!this.app.competition.isAdWatchable()),
        t
          ? this.app.fire("setPremiumActive")
          : this.app.fire("setPremiumInactive");
    } else this.app.fire("setPremiumActive");
    "landscape" == this.app.globals.layout
      ? ((this._adjustedCameraPos = this.app.getScreenAdjustedCameraPosition(
          this._myPosition,
          this.landscape
        )),
        this.app.fire(
          "cameraToStation",
          this._adjustedCameraPos,
          this.landscape.cameraRot,
          this.landscape.cameraFov
        ))
      : this.app.fire(
          "cameraToStation",
          this.portrait.cameraPos,
          this.portrait.cameraRot,
          this.portrait.cameraFov
        ),
      "pose" == t && this.app.fire("checkPosesLoaded"),
      this.entity.setLocalPosition(this.posHidden),
      this.icon.script.fade.fadeOut(),
      this.compLight && this.compLight.script.fade.fadeOut(),
      this.app.fire("playerRotation", !0),
      this.setActiveItem(),
      this.stationVisits++,
      (this.stationVisits < 5 || this.stationVisits % 5 == 0) &&
        this.app.fire(
          "watcher:track",
          "station_active_" + t + "_" + this.stationVisits
        ),
      setTimeout(
        function () {
          this.app.globals.localCharAnims.setAnimIdle();
        }.bind(this),
        200
      );
  }),
  (Station.prototype.setActiveItem = function () {
    let t = this.app.globals.localOutfit.selection;
    if (t) {
      let e = this.entity.name;
      switch (e) {
        case "pose":
        case "body":
        case "bodyComp":
        case "bodyVip":
          break;
        case "reset":
          this.app.root.findByName("resetRoom").enabled = !0;
          break;
        case "resetComp":
        case "resetVip":
          this.app.root.findByName("resetRoom").enabled = !1;
          break;
        case "stars":
          this.app.fire("showCollectibles", "stars");
          let i = this.app.environmentColorSystem.items;
          i.forEach(function (t) {
            t &&
              ((t.element.color = this.app.uiColors.inactive),
              (t.button.active = !0));
          }, this),
            (i[0].element.color = this.app.uiColors.pink),
            this.app.fire("disableAnimColors");
          break;
        default:
          let a = this.itemCategory;
          this.app.globals.activeItem = t[a].selected;
          let s = this.uiButtonGroup.findByName(t[a].selected);
          s && (s.element.color = this.app.uiColors.marigold),
            "hair" != e &&
              "eyes" != e &&
              "cheeks" != e &&
              "lips" != e &&
              this.app.fire("station:setupColorSlots", a);
      }
    }
  }),
  (Station.prototype.contains = function (t) {
    const e = this._myPosition;
    return (
      t.x < e.x + 1 &&
      t.x > e.x - 1 &&
      t.z < e.z + 1 &&
      t.z > e.z - 1 &&
      t.y < e.y + 2 &&
      t.y > e.y - 0.25
    );
  }),
  (Station.prototype.reset = function () {
    this.icon.script.fade.fadeIn(),
      this.compLight && this.compLight.script.fade.fadeIn(),
      this.entity.setLocalPosition(this.pos);
  });
var ClosePanel = pc.createScript("closePanel");
ClosePanel.attributes.add("disablesThese", {
  type: "json",
  array: !0,
  description: "What entities should be disabled with the close button",
  schema: [{ name: "itemToDisable", type: "entity" }],
}),
  (ClosePanel.prototype.initialize = function () {
    (this.stationExits = 0),
      this.entity.button.on(
        "click",
        function () {
          this.closePanels();
        },
        this
      ),
      this.app.on("escapeKey", this.closePanels, this),
      this.app.on(
        "competition:phase:start",
        this._onCompetitionPhaseStart,
        this
      );
  }),
  (ClosePanel.prototype._onCompetitionPhaseStart = function (t) {
    "showtime" == t && this.closePanels();
  }),
  (ClosePanel.prototype.closePanels = function () {
    this.app.globals.isAdPlaying ||
      (this.app.stationSystem.deactivate(),
      this.disablesThese.forEach(function (t) {
        t && (t.itemToDisable.enabled = !1);
      }),
      (this.entity.enabled = !1),
      (this.app.globals.activeItem = null),
      this.app.fire("cameraToWorld"),
      this.app.fire("playerRotation", !1),
      this.app.globals.localCharAnims.setAnimIdle(),
      "competition" == this.app.instance.name &&
        this.app.fire("compStation:exit"),
      (this.app.globals.activeStation = "world"),
      (this.app.globals.movementAllowed = !0),
      (this.app.globals.remotePlayerGroup.enabled = !0),
      this.app.fire("station:exit"));
  });
var Camera = pc.createScript("camera");
Camera.attributes.add("fovPortrait", { type: "number" }),
  Camera.attributes.add("xRotationPortrait", { type: "number" }),
  Camera.attributes.add("fovLandscape", { type: "number" }),
  Camera.attributes.add("xRotationLandscape", { type: "number" }),
  Camera.attributes.add("player", { type: "entity" }),
  Camera.attributes.add("playerPositionOffset", {
    type: "vec3",
    description: "Camera distance from the localPlayer",
    default: [0, 4, 8],
  }),
  Camera.attributes.add("stationTransitionS", {
    type: "number",
    default: 0.66,
    description:
      "Time (s) it takes for the camera to move in or out of a station",
  }),
  (Camera.prototype.initialize = function () {
    (this.app.camera = this),
      (this.startPos = new pc.Vec3()),
      (this.targetPos = new pc.Vec3()),
      (this.currentPos = new pc.Vec3()),
      (this.startingPlayerPositionOffset = this.playerPositionOffset.clone()),
      (this.startingEuler = this.entity.getEulerAngles().clone()),
      (this._tempVec = new pc.Vec3()),
      (this.startRot = new pc.Quat()),
      (this.targetRot = new pc.Quat()),
      (this.currentRot = new pc.Quat()),
      (this._transitionCountdownS = 0),
      (this.targetZ = 1),
      (this.targetFov = 50),
      this.app.on(
        "cameraToStation",
        function (t, e, i) {
          this.cameraToStation(t, e, i);
        },
        this
      ),
      this.app.on(
        "cameraToWorld",
        function () {
          this.cameraToWorld();
        },
        this
      ),
      this.app.on("resize", this.resizeCamera, this);
  }),
  (Camera.prototype.postInitialize = function () {
    (this.savedRot = this.entity.getRotation().clone()),
      "portrait" == this.app.globals.layout
        ? ((this.entity.camera.fov = this.fovPortrait),
          (this.targetFov = this.fovPortrait),
          this.entity.setEulerAngles(this.xRotationPortrait, 0, 0))
        : ((this.entity.camera.fov = this.fovLandscape),
          (this.targetFov = this.fovLandscape),
          this.entity.setEulerAngles(this.xRotationLandscape, 0, 0));
  }),
  (Camera.prototype.update = function (t) {
    const e = t / (1 / 60);
    let i = this.entity,
      a = this.targetFov;
    i.camera.fov != a &&
      (this.entity.camera.fov = pc.math.lerp(
        this.entity.camera.fov,
        a,
        0.1 * e
      ));
    let s = this._transitionCountdownS;
    if (s > 0) {
      (s -= t), s < 0 && (s = 0);
      const e = 1 - s / this.stationTransitionS;
      this.currentRot.slerp(this.startRot, this.targetRot, e),
        this.entity.setRotation(this.currentRot),
        "world" == this.app.globals.activeStation &&
          (this._tempVec
            .copy(this.player.getPosition())
            .add(this.playerPositionOffset),
          this.targetPos.copy(this._tempVec)),
        this.currentPos.lerp(this.startPos, this.targetPos, e),
        this.entity.setPosition(this.currentPos),
        (this._transitionCountdownS = s);
    } else this.cameraFollowPlayer(e);
  }),
  (Camera.prototype.snap = function () {
    this._tempVec
      .copy(this.player.getPosition())
      .add(this.playerPositionOffset),
      this.targetPos.copy(this._tempVec),
      this.currentPos.copy(this.targetPos),
      this.entity.setPosition(this.currentPos),
      (window.forceInstancerUpdate = !0);
  }),
  (Camera.prototype.cameraFollowPlayer = function (t) {
    this.app.globals.movementAllowed &&
      !1 === this.app.screenSystem.hasActiveScreen() &&
      (this._tempVec
        .copy(this.player.getPosition())
        .add(this.playerPositionOffset),
      this.targetPos.copy(this._tempVec),
      this.currentPos.lerp(this.currentPos, this.targetPos, 0.25 * t),
      this.entity.setPosition(this.currentPos));
  }),
  (Camera.prototype.cameraToStation = function (t, e, i, a) {
    (this._transitionCountdownS = this.stationTransitionS),
      this.startPos.copy(this.entity.getPosition()),
      this.targetPos.copy(t),
      this.startRot.copy(this.entity.getRotation()),
      this.targetRot.setFromEulerAngles(e.x, e.y, e.z),
      (this.targetFov = i),
      "landscape" == this.app.globals.layout && (this.targetZ = 0.61);
  }),
  (Camera.prototype.cameraToWorld = function () {
    (this._transitionCountdownS = this.stationTransitionS),
      this.startPos.copy(this.entity.getPosition()),
      this._tempVec
        .copy(this.player.getPosition())
        .add(this.playerPositionOffset),
      this.targetPos.copy(this._tempVec),
      this.startRot.copy(this.entity.getRotation()),
      this.targetRot.copy(this.savedRot),
      "landscape" == this.app.globals.layout
        ? ((this.targetZ = 1), (this.targetFov = this.fovLandscape))
        : (this.targetFov = this.fovPortrait);
  }),
  (Camera.prototype.resizeCamera = function () {
    var t = this.app.globals.activeStation;
    if ("world" == t)
      "portrait" == this.app.globals.layout
        ? ((this.entity.camera.fov = this.fovPortrait),
          (this.targetFov = this.fovPortrait),
          this.entity.setEulerAngles(this.xRotationPortrait, 0, 0))
        : ((this.entity.camera.fov = this.fovLandscape),
          (this.targetFov = this.fovLandscape),
          this.entity.setEulerAngles(this.xRotationLandscape, 0, 0));
    else if ("inventory" == t || "care" == t) {
      const t = this.app.gardening.activeGardenPatch;
      if (null == t) {
        const t = this.app.globals.localPlayer.getPosition(),
          e =
            this.app.screenSystem.screens.inventory.entity.script
              .inventoryScreen;
        let i =
          "landscape" == this.app.globals.layout
            ? e.cameraSettingsLandscape
            : e.cameraSettingsPortrait;
        i.cameraY = i.offsetY;
        const a = this.app.getLayoutAdjustedCameraPosition(t, i);
        this.cameraToStation(a, i.cameraRot, i.cameraFov, "resize");
      } else {
        const e = t.getCameraSettings(),
          i = t.worldButtonMarker.getPosition(),
          a = this.app.getLayoutAdjustedCameraPosition(i, e);
        this.cameraToStation(a, e.cameraRot, e.cameraFov, "resize");
      }
    } else {
      var e = this.app.areaSystem.getStation(t);
      if ("portrait" == this.app.globals.layout)
        this.cameraToStation(
          e.script.station.portrait.cameraPos,
          e.script.station.portrait.cameraRot,
          e.script.station.portrait.cameraFov,
          "resize"
        ),
          (this.targetZ = 1);
      else {
        const t = this.app.getScreenAdjustedCameraPosition(
          e.getPosition(),
          e.script.station.landscape
        );
        this.cameraToStation(
          t,
          e.script.station.landscape.cameraRot,
          e.script.station.landscape.cameraFov,
          "resize"
        ),
          (this.targetZ = 0.61);
      }
    }
  }),
  (Camera.prototype.setPlayerPositionOffset = function (t) {
    this.playerPositionOffset.copy(t);
  }),
  (Camera.prototype.resetPlayerPositionOffset = function () {
    this.playerPositionOffset.copy(this.startingPlayerPositionOffset);
  }),
  (Camera.prototype.setEulerRotation = function (t) {
    this.entity.setEulerAngles(t);
  }),
  (Camera.prototype.resetEulerRotation = function () {
    this.entity.setEulerAngles(this.startingEuler);
  });
var ColorSlots = pc.createScript("colorSlots");
ColorSlots.attributes.add("colorSlot1", { type: "entity" }),
  ColorSlots.attributes.add("blobIcon1", { type: "entity" }),
  ColorSlots.attributes.add("colorSlot2", { type: "entity" }),
  ColorSlots.attributes.add("blobIcon2", { type: "entity" }),
  ColorSlots.attributes.add("colorSlot3", { type: "entity" }),
  ColorSlots.attributes.add("blobIcon3", { type: "entity" }),
  ColorSlots.attributes.add("selectedSprite", { type: "asset" }),
  ColorSlots.attributes.add("unselectedSprite", { type: "asset" }),
  (ColorSlots.activeSlot = 1),
  (ColorSlots.prototype.initialize = function () {
    this.app.on(
      "station:setupColorSlots",
      function (t) {
        this.stationSlotSetup(t);
      },
      this
    ),
      this.app.on(
        "fashionItem:colorSlots",
        function (t) {
          this.setNumOfSlots(t), this.setActiveSlot(1);
        },
        this
      ),
      this.colorSlot1.button.on(
        "click",
        function () {
          "stars" != this.app.globals.activeStation &&
            (this.setActiveSlot(1), this.app.fire("sound:pop:pitch1.5"));
        },
        this
      ),
      this.colorSlot2.button.on(
        "click",
        function () {
          this.setActiveSlot(2), this.app.fire("sound:pop:pitch1.5");
        },
        this
      ),
      this.colorSlot3.button.on(
        "click",
        function () {
          this.setActiveSlot(3), this.app.fire("sound:pop:pitch1.5");
        },
        this
      ),
      this.app.on(
        "setColorSelectedState",
        function (t) {
          this.setIconColor(t);
        },
        this
      );
  }),
  (ColorSlots.prototype.stationSlotSetup = function (t) {
    let o = this.app.globals.localOutfit.selection;
    const l = this.app.itemDb.getItem(o[t].selected);
    if (l) {
      let t = l.colorSlots;
      this.setNumOfSlots(t), this.setActiveSlot(1);
    }
  }),
  (ColorSlots.prototype.setNumOfSlots = function (t) {
    let o = this.app.itemDb.getItem(this.app.globals.activeItem);
    function setBlobColor(t, o) {
      let l = this.app.globals.ui.findByName(o);
      l &&
        ((t.element.color = l.element.color),
        0 == l.script.colorButton.hasCustomSprite
          ? (t.element.spriteAsset = this.unselectedSprite)
          : (t.element.spriteAsset = l.element.spriteAsset));
    }
    1 == t
      ? ((this.colorSlot2.enabled = !1),
        (this.colorSlot3.enabled = !1),
        setBlobColor.call(this, this.blobIcon1, o.color1))
      : 2 == t
      ? ((this.colorSlot2.enabled = !0),
        (this.colorSlot3.enabled = !1),
        setBlobColor.call(this, this.blobIcon1, o.color1),
        setBlobColor.call(this, this.blobIcon2, o.color2))
      : 3 == t &&
        ((this.colorSlot2.enabled = !0),
        (this.colorSlot3.enabled = !0),
        setBlobColor.call(this, this.blobIcon1, o.color1),
        setBlobColor.call(this, this.blobIcon2, o.color2),
        setBlobColor.call(this, this.blobIcon3, o.color3));
  }),
  (ColorSlots.prototype.setActiveSlot = function (t) {
    (this.colorSlotButtons = this.app.globals.ui.findByTag("colorSlotButton")),
      this.colorSlotButtons.forEach(function (t) {
        t.element.opacity = 0;
      }),
      1 == t
        ? ((this.colorSlot1.element.opacity = 1), (ColorSlots.activeSlot = 1))
        : 2 == t
        ? ((this.colorSlot2.element.opacity = 1), (ColorSlots.activeSlot = 2))
        : 3 == t &&
          ((this.colorSlot3.element.opacity = 1), (ColorSlots.activeSlot = 3)),
      this.setActiveColor();
  }),
  (ColorSlots.prototype.setActiveColor = function () {
    let t;
    if ("stars" != this.app.globals.activeStation)
      (t = this.app.itemDb.getItem(this.app.globals.activeItem)),
        1 == ColorSlots.activeSlot
          ? this.app.fire("setColorSelectedState", t.color1)
          : 2 == ColorSlots.activeSlot
          ? this.app.fire("setColorSelectedState", t.color2)
          : 3 == ColorSlots.activeSlot &&
            this.app.fire("setColorSelectedState", t.color3);
    else {
      let t = this.app.globals.env;
      if (Object.keys(t).length > 0) {
        let o = t.find((t) => t.name == this.app.globals.activeItem);
        this.app.fire("setColorSelectedState", o.color);
      }
    }
  }),
  (ColorSlots.prototype.setIconColor = function (t) {
    let o,
      l = this.app.globals.ui.findByName(t);
    1 == ColorSlots.activeSlot || null == ColorSlots.activeSlot
      ? (o = this.blobIcon1)
      : 2 == ColorSlots.activeSlot
      ? (o = this.blobIcon2)
      : 3 == ColorSlots.activeSlot && (o = this.blobIcon3),
      l &&
        ((o.element.color = l.element.color),
        l.element.spriteAsset == this.selectedSprite ||
        l.element.spriteAsset == this.unselectedSprite
          ? (o.element.spriteAsset = this.unselectedSprite)
          : (o.element.spriteAsset = l.element.spriteAsset));
  });
var Shaders = pc.createScript("shaders");
Shaders.attributes.add("enableShaders", { type: "boolean" }),
  Shaders.attributes.add("list", { type: "asset", array: !0 }),
  (Shaders.shaderData = {
    rainbow:
      "\n            uniform float globalTime;\n\n            void getAlbedo() {\n                vec2 p = -1.0 + 2.0 * vUv1;\n                vec3 col = 0.5 + 0.5*sin(globalTime+p.xyx+vec3(0,2,4));\n                dAlbedo = vec3(col);\n            }\n        ",
    hearts:
      "\n            uniform float globalTime;\n\n\n            float heartShape(vec2 p) {\n                p *= 2.0;\n                p.y -= 0.5;\n                p.x *= 0.75;\n                float a = atan(p.x, p.y) / 3.14159;\n                float r = length(p);\n                float h = abs(a) - (r + 0.1);\n                return h;\n            }\n\n            void getAlbedo()\n            {\n                vec2 uv = vUv1;\n                uv = 1.0 - uv;\n\n                // Make the pattern move diagonally\n                uv += globalTime * 0.1;\n\n                // Tile the space\n                vec2 i = floor(uv * 5.0);\n                vec2 f = fract(uv * 5.0) - 0.5;\n\n                // Create heart shape pattern\n                float heart = heartShape(f);\n                vec3 colorbg = vec3(0.,0.,0.);\n                vec3 colorheart = 0.5 + 0.5*cos(globalTime+uv.xyx+vec3(0.0,2.0,4.0));\n\n                // Smooth transition for the heart shape\n                float shape = smoothstep(0.02, 0.01, heart);\n                vec3 finalColor = mix(colorheart, colorbg, shape);\n\n                dAlbedo = vec3(finalColor);\n\n            }\n        ",
    flowerLight:
      "\n        uniform float globalTime;\n\n        float flowerShape(vec2 p) {\n            p *= 1.0;\n            vec2 pos = vec2(0.5) - p;\n            float r = length(pos) * 2.5;\n            float a = atan(pos.y, pos.x);\n            float f = abs(cos(a * 2.5));\n            \n            return 1.0 - smoothstep(f, f + 0.02, r);\n        }\n\n        void getAlbedo()\n        {\n            vec2 uv = vUv1;\n            uv = 1.0 - uv;\n\n            uv += globalTime * 0.1;\n            vec2 f = fract(uv * 3.0);\n\n            float flower = flowerShape(f);\n            vec3 colorbg = vec3(0.9,0.6,0.8);\n            vec3 colorflower = 1.2 + cos((globalTime*0.5)+uv.yxy+vec3(0.0,2.0,2.0));\n\n            float shape = flower*0.5;\n            vec3 finalColor = mix(colorbg, colorflower, shape);\n\n            dAlbedo = vec3(finalColor);\n        }\n    ",
    digidots:
      "\n            uniform float globalTime;\n\n            vec3 palette(float t) {\n                vec3 a = vec3(0.439, 0.420, 0.420);\n                vec3 b = vec3(0.322, 0.318, 0.322);\n                vec3 c = vec3(0.447, 0.431, 0.443);\n                vec3 d = vec3(0.000, 0.000, 0.000);\n                \n                return a + b * cos(1.28318 * (c * t + d));\n            }\n\n            void getAlbedo() {\n\n                //varying UV, channel 0\n                vec2 p = -1.0 + 2.0 * vUv1;\n\n                vec2 uv = vUv1;\n\n                vec2 uv0 = uv;\n                vec3 finalColor = vec3(0.0);\n                \n                for (float i = 0.0; i < 1.0; i++) {\n                    uv = fract(uv * 0.1);\n                    float d = length(uv);\n                    vec3 col = palette(globalTime * 3.0 + i + length(uv0));\n                    d = sin(d * 1000.0 + (globalTime) / 4.0) / 8.0;\n                    d = abs(d);\n                    d = 0.009 / d;\n                    finalColor += col * d;\n                }\n\n                dAlbedo = vec3(finalColor);\n            }\n        ",
    dotPulse:
      "\n            uniform float globalTime;\n\n            float hash(vec2 p) {\n                p = fract(p * vec2(123.34, 456.21));\n                p += dot(p, p + 45.32);\n                return fract(p.x * p.y);\n            }\n            vec3 colorize(float t) {\n                return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.3, 0.6)));\n            }\n\n            void getAlbedo(){\n                vec2 uv = vUv1;\n                \n                float zoom = sin(globalTime * 0.1) * 0.5 + 1.5;\n                uv *= zoom;\n                \n                vec2 gv = fract(uv * 10.0) - 0.5;\n                vec2 id = floor(uv * 10.0);\n                \n                float n = hash(id);\n                float t = globalTime;\n                \n                float d = length(gv);\n                float pixwidth = zoom * 15.0 / uv.y;\n                float r = 0.3 + 0.2 * sin(t * 6.28318 + n * 6.28318);\n                float c = smoothstep(r, r * 0.9, d);\n                \n                vec3 col = colorize(n + globalTime * 0.3);\n\n                col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d - r)));\n                \n                float borderWidth = pixwidth * 0.01;\n                \n                vec3 bgColor = vec3(0.9, 0.9, 0.9);\n                col = mix(bgColor, col, c);\n                \n                dAlbedo = vec3(col);\n            }\n        \n        ",
    neonplaid:
      "\n            uniform float globalTime;\n\n            void getAlbedo()\n            {\n                vec2 uv = vUv1 * 10.0;\n                float pattern = sin(uv.x * 10.0 + globalTime * 5.0) * cos(uv.y * 10.0 + globalTime * 5.0);\n                vec3 color = vec3(\n                    0.5 + 0.5 * cos(globalTime + uv.x * 3.0 + pattern),\n                    0.5 + 0.5 * cos(globalTime + uv.y * 3.0 + pattern + 2.0),\n                    0.5 + 0.5 * cos(globalTime + (uv.x + uv.y) * 3.0 + pattern + 4.0)\n                );\n                dAlbedo = vec3(color);\n            }\n        \n        ",
    sparkleDotsDark:
      "\n            uniform float globalTime;\n\n            void getAlbedo()\n            {\n                vec2 p = vUv1 * 10.0; // Scale the UV coordinates to create multiple sparkles\n\n                // Calculate the sparkle effect\n                vec2 grid = fract(p);\n                vec2 id = floor(p);\n                float dist = length(grid - 0.5);\n                float angle = atan(grid.y - 0.5, grid.x - 0.5);\n                float sparkle = 0.5 + 0.5 * sin(20.0 * angle + globalTime * 10.0);\n                float radius = 0.1 + 0.05 * sin(globalTime * 5.0 + id.x + id.y);\n                float intensity = smoothstep(radius, radius - 0.01, dist) * sparkle;\n\n                // Generate a multicolored effect based on grid position and time\n                vec3 color = 0.5 + 0.5 * cos(globalTime + id.xyx * vec3(0.3, 0.6, 0.9) + vec3(0, 2, 4));\n\n                vec3 fragColor = vec3(color * intensity);\n\n                dAlbedo = vec3(fragColor);\n            } \n        ",
    sparklesGold:
      "\n            uniform float globalTime;\n\n            float noise(vec2 st) {\n                return fract(sin(dot(st.xy, vec2(2.9898,8.233))) * 43758.5453123);\n            }\n\n\n            void getAlbedo(){\n            vec2 uv = vUv1;\n            vec3 baseColorDark = vec3(0.73, 0.64, 0.3);\n            vec3 baseColorLight = vec3(0.8, 0.7, 0.4); \n\n            float colorPulse = sin(globalTime * 0.5) * 0.5 + 0.5;\n            vec3 baseColor = mix(baseColorDark, baseColorLight, colorPulse);\n                \n            float glitterSize = 0.003;\n            vec2 glitterUV = uv / glitterSize;\n            vec2 glitterID = floor(glitterUV);\n            vec2 glitterLocal = fract(glitterUV);\n                \n            float glitterIntensity = 0.0;\n            for (int y = -1; y <= 1; y++) {\n                    for (int x = -1; x <= 1; x++) {\n                        vec2 offset = vec2(float(x), float(y));\n                        float n = noise(glitterID + offset);\n                        float glitterTime = fract(n + globalTime * 0.5);\n                        float glitter = smoothstep(0.9, 1.0, glitterTime) * smoothstep(1.0, 0.9, glitterTime);\n                        glitterIntensity += glitter;\n                    }\n            }\n                \n            vec3 finalColor = baseColor + vec3(glitterIntensity) * 0.7;\n            \n            dAlbedo = vec3(finalColor);\n            }\n        ",
    sparklesPink:
      "\n            uniform float globalTime;\n\n            float noise(vec2 st) {\n                return fract(sin(dot(st.xy, vec2(2.9898,8.233))) * 43758.5453123);\n            }\n\n\n            void getAlbedo(){\n                vec2 uv = vUv1;\n                vec3 baseColorDark = vec3(0.88, 0.25, 0.51);\n                vec3 baseColorLight = vec3(0.9, 0.3, 0.6); \n\n                float colorPulse = sin(globalTime * 0.5) * 0.5 + 0.5;\n                vec3 baseColor = mix(baseColorDark, baseColorLight, colorPulse);\n                    \n                float glitterSize = 0.003;\n                vec2 glitterUV = uv / glitterSize;\n                vec2 glitterID = floor(glitterUV);\n                vec2 glitterLocal = fract(glitterUV);\n                    \n                float glitterIntensity = 0.0;\n                for (int y = -1; y <= 1; y++) {\n                    for (int x = -1; x <= 1; x++) {\n                        vec2 offset = vec2(float(x), float(y));\n                        float n = noise(glitterID + offset);\n                        float glitterTime = fract(n + globalTime * 0.5);\n                        float glitter = smoothstep(0.9, 1.0, glitterTime) * smoothstep(1.0, 0.9, glitterTime);\n                        glitterIntensity += glitter;\n                    }\n                }\n                    \n                vec3 finalColor = baseColor + vec3(glitterIntensity) * 0.7;\n                \n                dAlbedo = vec3(finalColor);\n            }\n        ",
    snowflakes:
      "\n            uniform float globalTime;\n            #define _SnowflakeAmount 100\n            #define _BlizardFactor 0.01\n            \n            \n            \n            float rnd(float x) {\n                return fract(x * 43758.5453123);\n            }\n\n            float drawCircle(vec2 center, float radius) {\n                return 1.0 - smoothstep(0.0, radius, length(vUv1 - center));\n            }\n    \n\n            void getAlbedo() {\n                vec2 uv = vUv1;\n                vec3 fragColor = vec3(0.44, 0.73, 0.96);\n\n                //first number in fragColor output below is snowflake contrast intensity\n\n                for (int i = 0; i < _SnowflakeAmount; i++) {\n                    float j = float(i);\n                    float speed = 0.3 + rnd(cos(j)) * (0.7 + 0.5 * cos(j / 50.0));\n                    vec2 center = vec2((0.25 - uv.y) * _BlizardFactor + rnd(j) + 0.1 * cos(globalTime + sin(j)), mod(sin(j) + speed * (globalTime * (0.1 + _BlizardFactor)), 1.0));\n                    fragColor += 0.2 * drawCircle(center, 0.001 + speed * 0.012);\n                }\n                \n                // Output emission\n                dAlbedo = vec3(fragColor);\n            }\n        ",
    pinkGrad:
      "\n            uniform float globalTime;\n\n            void getAlbedo() {\n                vec2 p = -1.0 + 2.0 * vUv1;\n                vec3 bg = vec3(0.9,0.6,0.9);\n                vec3 col = 0.5 + 0.5*cos(globalTime+p.xyx+vec3(2.,0.,4.));\n                vec3 final = mix(col, bg, 0.8);\n                dAlbedo = vec3(final);\n            }\n        ",
  }),
  (Shaders.prototype.initialize = function () {
    this.list.forEach(function (n) {
      var e = n.resource;
      (e.chunks.APIVersion = pc.CHUNKAPI_1_70),
        (e.chunks.diffusePS = Shaders.shaderData[n.name]),
        (e.diffuseMap = new pc.Texture(this.app.graphicsDevice, {
          width: 1,
          height: 1,
          format: pc.PIXELFORMAT_R8_G8_B8,
        })),
        (e.forceUv1 = !0),
        e.setParameter("globalTime", 0),
        e.update();
    }, this),
      (this.time = 0);
  }),
  (Shaders.prototype.update = function (n) {
    this.enableShaders &&
      ((this.time += n),
      this.list.forEach(function (n) {
        n.resource.setParameter("globalTime", this.time);
      }, this));
  });
var BgItem = pc.createScript("bgItem");
BgItem.attributes.add("bgMaterial", { type: "asset" }),
  BgItem.attributes.add("backdrop", { type: "entity" }),
  (BgItem.prototype.initialize = function () {
    this.entity.button.on(
      "click",
      function () {
        this.updateBgMaterial(), this.app.fire("sound:pop:pitch1");
      },
      this
    );
  }),
  (BgItem.prototype.updateBgMaterial = function () {
    this.backdrop.render.meshInstances[0].material = this.bgMaterial.resource;
  });
var AnimateSprite = pc.createScript("animateSprite");
AnimateSprite.attributes.add("playing", { type: "boolean" }),
  AnimateSprite.attributes.add("frames", { type: "number" }),
  AnimateSprite.attributes.add("frameRate", {
    type: "number",
    default: 3,
    description:
      "Play the next animation img every X frames. Higher is slower.",
  }),
  (AnimateSprite.prototype.initialize = function () {
    this._countdownS = 1 / this.frameRate;
  }),
  (AnimateSprite.prototype.update = function (t) {
    this.playing &&
      ((this._countdownS -= t),
      this._countdownS <= 0 &&
        ((this._countdownS = 1 / this.frameRate),
        this.entity.element.spriteFrame < this.frames - 1
          ? this.entity.element.spriteFrame++
          : (this.entity.element.spriteFrame = 0)));
  });
var SoundButton = pc.createScript("soundButton");
SoundButton.attributes.add("soundOffIcon", { type: "asset" }),
  SoundButton.attributes.add("soundOnIcon", { type: "asset" }),
  SoundButton.attributes.add("iconEntity", { type: "entity" }),
  (SoundButton.prototype.initialize = function () {
    this.entity.button.on(
      "click",
      function () {
        this.toggleSound();
      },
      this
    ),
      this.app.on("soundOn", this.turnSoundOn, this),
      this.app.on("soundOff", this.turnSoundOff, this);
  }),
  (SoundButton.prototype.turnSoundOn = function () {
    (this.iconEntity.element.spriteAsset = this.soundOnIcon.id),
      (this.app.globals.isSoundOn = !0),
      this.app.fire("musicStart"),
      this.app.saveStats("isSoundOn", this.app.globals.isSoundOn),
      (this.app.systems.sound.volume = 1);
  }),
  (SoundButton.prototype.turnSoundOff = function () {
    (this.iconEntity.element.spriteAsset = this.soundOffIcon.id),
      (this.app.globals.isSoundOn = !1),
      this.app.fire("musicStop"),
      this.app.saveStats("isSoundOn", this.app.globals.isSoundOn),
      (this.app.systems.sound.volume = 0);
  }),
  (SoundButton.prototype.toggleSound = function () {
    this.app.globals.isSoundOn ? this.turnSoundOff() : this.turnSoundOn();
  });
var ScreenshotButton = pc.createScript("screenshotButton");
ScreenshotButton.prototype.initialize = function () {
  (this.numOfScreenshots = 0),
    this.entity.button.on(
      "click",
      function () {
        this.numOfScreenshots++,
          this.app.fire("fabUi:takeScreenshot"),
          (this.numOfScreenshots < 5 || this.numOfScreenshots % 10 == 0) &&
            this.app.fire(
              "watcher:track",
              "fab_screenshot_" + this.numOfScreenshots
            ),
          this.app.fire("sound:pop:pitch0.5");
      },
      this
    );
};
var Music = pc.createScript("music");
Music.attributes.add("fadeInTime", { type: "number", default: 1 }),
  Music.attributes.add("musicFile", { type: "entity" }),
  Music.attributes.add("soundObjects", {
    type: "entity",
    array: !0,
    description:
      "Entities with sound components to enable on audio:ready event",
  }),
  (Music.prototype.initialize = function () {
    (this.fadeCountdown = 0),
      (this.gameplayStarted = !1),
      (this.musicLoaded = !1),
      this.app.once(
        "audio:ready",
        () => {
          (this.musicLoaded = !0),
            this.soundObjects.forEach((t) => {
              t.enabled = !0;
            }),
            this.start();
        },
        this
      ),
      this.app.once(
        "poki:firstInteraction",
        function () {
          (this.gameplayStarted = !0), this.start();
        },
        this
      ),
      this.app.on("musicStop", this.stop, this),
      this.app.on("musicStart", this.start, this);
  }),
  (Music.prototype.update = function (t) {
    this.fadeCountdown > 0 &&
      ((this.fadeCountdown -= t),
      (this.musicFile.sound.volume =
        0.8 - this.fadeCountdown / this.fadeInTime));
  }),
  (Music.prototype.start = function () {
    this._isLocalPlayerEmoteMusicPlaying() ||
      this.musicFile.sound.isPlaying("theme0") ||
      (this.musicLoaded &&
        this.gameplayStarted &&
        this.app.globals.isSoundOn &&
        ((this.musicFile.enabled = !0),
        (this.musicFile.sound.volume = 0),
        this.musicFile.sound.play("theme0"),
        (this.fadeCountdown = this.fadeInTime)));
  }),
  (Music.prototype.stop = function () {
    this.musicFile.sound.pause("theme0");
  }),
  (Music.prototype._isLocalPlayerEmoteMusicPlaying = function () {
    const t = this.app.globals.localCharAnims;
    return !(!t || !t.sound.isPlaying("emoteMusic"));
  });
var DressToggle = pc.createScript("dressToggle");
DressToggle.attributes.add("dressNoneBtn", { type: "entity" }),
  DressToggle.attributes.add("topsNoneBtn", { type: "entity" }),
  DressToggle.attributes.add("bottomsNoneBtn", { type: "entity" }),
  (DressToggle.prototype.initialize = function () {
    this.app.on(
      "dressToggle:station:check",
      function (t) {
        this.stationCheck(t);
      },
      this
    ),
      this.app.on(
        "dressToggle:set:inactive",
        (t) => {
          let e = this.app.globals.ui.findByName(t);
          e && (e.element.color = this.app.uiColors.inactive);
        },
        this
      ),
      this.dressNoneBtn.button.on(
        "click",
        function () {
          this.toggleDressOff(),
            (this.dressNoneBtn.element.color = this.app.uiColors.marigold);
        },
        this
      ),
      this.topsNoneBtn.button.on(
        "click",
        function () {
          this.toggleDressOn(),
            (this.topsNoneBtn.element.color = this.app.uiColors.violet);
        },
        this
      ),
      this.bottomsNoneBtn.button.on(
        "click",
        function () {
          this.toggleDressOn(),
            (this.bottomsNoneBtn.element.color = this.app.uiColors.purple);
        },
        this
      );
  }),
  (DressToggle.prototype.stationCheck = function (t) {
    let e = this.app.globals.localOutfit.selection;
    if (e)
      switch (t) {
        case "tops":
        case "bottoms":
          if (e.isWearingDress && "robe" != e.dresses.selected) {
            (this.topsNoneBtn.enabled = !0),
              (this.topsNoneBtn.element.color = this.app.uiColors.violet),
              (this.bottomsNoneBtn.enabled = !0),
              (this.bottomsNoneBtn.element.color = this.app.uiColors.purple);
            let t = this.entity.findByName(e.tops.selected);
            null != t && (t.element.color = this.app.uiColors.inactive);
            let s = this.entity.findByName(e.bottoms.selected);
            null != s && (s.element.color = this.app.uiColors.inactive);
          } else
            (this.topsNoneBtn.enabled = !1), (this.bottomsNoneBtn.enabled = !1);
          break;
        case "dresses":
          if (0 == e.isWearingDress) {
            (this.dressNoneBtn.enabled = !0),
              (this.dressNoneBtn.element.color = this.app.uiColors.marigold);
            let t = this.entity.findByName(e.dresses.selected);
            null != t && (t.element.color = this.app.uiColors.inactive);
          } else this.dressNoneBtn.enabled = !1;
      }
  }),
  (DressToggle.prototype.toggleDressOff = function () {
    this.app.globals.localOutfit.setDressState(!1);
    let t = this.app.globals.localOutfit.selection,
      e = this.entity.findByName(t.dresses.selected);
    e && (e.element.color = this.app.uiColors.inactive);
  }),
  (DressToggle.prototype.toggleDressOn = function () {
    this.app.globals.localOutfit.setDressState(!0);
  });
var MovementControlSystem = pc.createScript("movementControlSystem");
MovementControlSystem.attributes.add("jumpButton", { type: "entity" }),
  MovementControlSystem.attributes.add("thumbstick", { type: "entity" }),
  (MovementControlSystem.prototype.postInitialize = function () {
    (this.app.inputState = {
      angleDeg: 270,
      pressingLeft: !1,
      pressingRight: !1,
      pressingUp: !1,
      pressingDown: !1,
      pressingJump: !1,
      pressingAny: !1,
      isTouching: !1,
      isMouseDown: !1,
      isJumpInProgress: !1,
      isUsingKeyboardToMove: this._isUsingKeyboardToMove.bind(this),
      isUsingMouseToMove: this._isUsingMouseToMove.bind(this),
    }),
      (this._MOUSE_OUT_EDGE_BUFFER = 5),
      (this._touchStart = new pc.Vec2()),
      (this._lastTouch = new pc.Vec2()),
      (this._movementTouchId = null),
      this.app.on("window:blur", this._stopAllInputs, this),
      this.app.on("station:enter", this._stopAllInputs, this),
      this.app.on("menu:open", this._stopAllInputs, this),
      this.app.touch &&
        (this.app.touch.on(pc.EVENT_TOUCHMOVE, this._onTouchMove, this),
        this.app.touch.on(pc.EVENT_TOUCHSTART, this._onTouchStart, this),
        this.app.touch.on(pc.EVENT_TOUCHEND, this._onTouchEnd, this),
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this._onTouchEnd, this)),
      this.app.mouse &&
        (this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this),
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this),
        this.app.mouse.on(pc.EVENT_MOUSEUP, this._onMouseUp, this)),
      this.app.keyboard &&
        (this.app.keyboard.on(pc.EVENT_KEYDOWN, this._onKeyDown, this),
        this.app.keyboard.on(pc.EVENT_KEYUP, this._onKeyUp, this)),
      (this._thumbstick = this.thumbstick.script.uiThumbstick),
      this.jumpButton.button.on(
        "touchstart",
        this._onJumpButtonTouchStart,
        this
      ),
      this.jumpButton.button.on("touchend", this._onJumpButtonTouchEnd, this),
      this.jumpButton.button.on("touchleave", this._onJumpButtonTouchEnd, this),
      this.jumpButton.button.on(
        "touchcancel",
        this._onJumpButtonTouchEnd,
        this
      );
  }),
  (MovementControlSystem.prototype._stopAllInputs = function () {
    let t = this.app.inputState;
    (t.pressingLeft = !1),
      (t.pressingRight = !1),
      (t.pressingUp = !1),
      (t.pressingDown = !1),
      (t.pressingJump = !1),
      (t.pressingAny = !1),
      (t.isTouching = !1),
      (t.isMouseDown = !1),
      (t.isJumpInProgress = !1),
      (this.app.inputState = t),
      this._touchStart.set(0, 0),
      this._lastTouch.set(0, 0),
      this.thumbstick.script.uiThumbstick.reset(),
      this.app.globals.localPlayer.script.localPlayer.transmitCurrentState();
  }),
  (MovementControlSystem.prototype._onTouchMove = function (t) {
    if (
      (this.app.fire("poki:firstInteraction"),
      !1 !== this.app.globals.movementAllowed)
    ) {
      this.app.globals.localCharAnims.setAnimWalk(!0);
      for (let s in t.changedTouches) {
        let o = t.changedTouches[s];
        if (o.id === this._movementTouchId)
          return (
            this._lastTouch.set(o.x, o.y),
            this._thumbstick.touchMove(o.x, o.y),
            void (this.app.inputState.isTouching = !0)
          );
      }
    }
  }),
  (MovementControlSystem.prototype._onTouchStart = function (t) {
    if (!1 !== this.app.globals.movementAllowed)
      for (let s in t.changedTouches) {
        let o = t.changedTouches[s];
        if (null === this._movementTouchId)
          return (
            (this._movementTouchId = o.id),
            this._touchStart.set(o.x, o.y),
            void this._thumbstick.touchStart(o.x, o.y)
          );
      }
  }),
  (MovementControlSystem.prototype._onTouchEnd = function (t) {
    for (let s in t.changedTouches) {
      if (t.changedTouches[s].id === this._movementTouchId)
        return (
          (this._movementTouchId = null),
          this._touchStart.set(0, 0),
          this._lastTouch.set(0, 0),
          (this.app.inputState.isTouching = !1),
          void this._thumbstick.touchEnd()
        );
    }
  }),
  (MovementControlSystem.prototype._onMouseDown = function (t) {
    this.app.fire("poki:firstInteraction"),
      !1 !== this.app.globals.movementAllowed &&
        (this._isUsingKeyboardToMove() ||
          (this.app.globals.localCharAnims.setAnimWalk(!0),
          (this.app.inputState.isMouseDown = !0),
          this._touchStart.set(t.x, t.y),
          this._thumbstick.touchStart(t.x, t.y)));
  }),
  (MovementControlSystem.prototype._onMouseMove = function (t) {
    if (this.app.globals.movementAllowed && this.app.inputState.isMouseDown) {
      if (
        t.x < this._MOUSE_OUT_EDGE_BUFFER ||
        t.x > this.app.graphicsDevice.width - this._MOUSE_OUT_EDGE_BUFFER ||
        t.y < this._MOUSE_OUT_EDGE_BUFFER ||
        t.y > this.app.graphicsDevice.height - this._MOUSE_OUT_EDGE_BUFFER
      )
        return void this._onMouseUp();
      this._lastTouch.set(t.x, t.y), this._thumbstick.touchMove(t.x, t.y);
    }
  }),
  (MovementControlSystem.prototype._onMouseUp = function (t) {
    this._touchStart.set(0, 0),
      this._lastTouch.set(0, 0),
      this._thumbstick.touchEnd(),
      (this.app.inputState.isMouseDown = !1);
  }),
  (MovementControlSystem.prototype._onKeyDown = function (t) {
    t.key === pc.KEY_ESCAPE && this.app.fire("escapeKey"),
      t.key === pc.KEY_ENTER && this.app.fire("enterKey"),
      this.app.fire("poki:firstInteraction"),
      !1 === this.app.globals.movementAllowed ||
        this.app.globals.keyboardMovementBlocked ||
        (t.key === pc.KEY_A || t.key === pc.KEY_LEFT
          ? ((this.app.inputState.pressingLeft = !0),
            this.app.globals.localCharAnims.setAnimWalk(!0))
          : t.key === pc.KEY_D || t.key === pc.KEY_RIGHT
          ? ((this.app.inputState.pressingRight = !0),
            this.app.globals.localCharAnims.setAnimWalk(!0))
          : t.key === pc.KEY_W || t.key === pc.KEY_UP
          ? ((this.app.inputState.pressingUp = !0),
            this.app.globals.localCharAnims.setAnimWalk(!0))
          : t.key === pc.KEY_S || t.key === pc.KEY_DOWN
          ? ((this.app.inputState.pressingDown = !0),
            this.app.globals.localCharAnims.setAnimWalk(!0))
          : t.key !== pc.KEY_SPACE ||
            this.app.globals.keyboardMovementBlocked ||
            (this.app.inputState.pressingJump = !0));
  }),
  (MovementControlSystem.prototype._onKeyUp = function (t) {
    t.key === pc.KEY_A || t.key === pc.KEY_LEFT
      ? (this.app.inputState.pressingLeft = !1)
      : t.key === pc.KEY_D || t.key === pc.KEY_RIGHT
      ? (this.app.inputState.pressingRight = !1)
      : t.key === pc.KEY_W || t.key === pc.KEY_UP
      ? (this.app.inputState.pressingUp = !1)
      : t.key === pc.KEY_S || t.key === pc.KEY_DOWN
      ? (this.app.inputState.pressingDown = !1)
      : t.key === pc.KEY_SPACE && (this.app.inputState.pressingJump = !1);
  }),
  (MovementControlSystem.prototype._onJumpButtonTouchStart = function () {
    (this.app.inputState.pressingJump = !0),
      this.jumpButton.script.pulse.start();
  }),
  (MovementControlSystem.prototype._onJumpButtonTouchEnd = function () {
    this.app.inputState.pressingJump = !1;
  }),
  (MovementControlSystem.prototype.update = function (t) {
    this._updateInputDirection();
  }),
  (MovementControlSystem.prototype._updateInputDirection = function () {
    let t = this.app.inputState;
    if (
      (!1 === this._isUsingKeyboardToMove() &&
        ((t.pressingLeft = !1),
        (t.pressingRight = !1),
        (t.pressingUp = !1),
        (t.pressingDown = !1)),
      t.isTouching || t.isMouseDown)
    ) {
      const s = this._lastTouch,
        o = this._touchStart,
        e = s.x - o.x,
        i = s.y - o.y,
        p = Math.atan2(i, e);
      t.angleDeg = 180 - (p * pc.math.RAD_TO_DEG + 180);
    }
    this.app.inputState = t;
  }),
  (MovementControlSystem.prototype._isUsingKeyboardToMove = function () {
    return (
      this.app.keyboard.isPressed(pc.KEY_A) ||
      this.app.keyboard.isPressed(pc.KEY_D) ||
      this.app.keyboard.isPressed(pc.KEY_W) ||
      this.app.keyboard.isPressed(pc.KEY_S) ||
      this.app.keyboard.isPressed(pc.KEY_UP) ||
      this.app.keyboard.isPressed(pc.KEY_LEFT) ||
      this.app.keyboard.isPressed(pc.KEY_DOWN) ||
      this.app.keyboard.isPressed(pc.KEY_RIGHT)
    );
  }),
  (MovementControlSystem.prototype._isUsingMouseToMove = function () {
    const t = this._touchStart;
    return this.app.inputState.isMouseDown || (0 !== t.x && 0 !== t.y);
  });
var UiThumbstick = pc.createScript("uiThumbstick");
UiThumbstick.attributes.add("hud", { type: "entity" }),
  UiThumbstick.attributes.add("stick", { type: "entity" }),
  UiThumbstick.attributes.add("backing", { type: "entity" }),
  UiThumbstick.attributes.add("player", { type: "entity" }),
  UiThumbstick.attributes.add("fadeTimeS", { type: "number", default: 1 }),
  (UiThumbstick.prototype.initialize = function () {
    (this._backingScreenPos = new pc.Vec2()),
      (this._touchStartPos = new pc.Vec2()),
      (this._touchMovePos = new pc.Vec2()),
      (this._stickPos = new pc.Vec2()),
      (this._stickDistance = 0),
      (this._fadeCountdownS = 0),
      (this._fadeDirection = ""),
      (this.stick.element.enabled = !1),
      (this.backing.element.enabled = !1),
      (this._startOpacity = this.backing.element.opacity),
      (this.pixelRatio = this.app.graphicsDevice.maxPixelRatio),
      (this._backingRadius = 0.5 * this.backing.element.width);
  }),
  (UiThumbstick.prototype.hasInput = function () {
    return this._stickDistance > 0;
  }),
  (UiThumbstick.prototype.getInputPercentage = function () {
    const t = this._stickDistance / this._backingRadius;
    return t > 1 ? 1 : t < 0 ? 0 : t;
  }),
  (UiThumbstick.touchAngleRad = null),
  (UiThumbstick.prototype.touchStart = function (t, i) {
    if (this.backing.element.enabled && "out" !== this._fadeDirection) return;
    this._touchStartPos.set(t, i);
    let e = this._backingScreenPos;
    e.set(t, -i), e.mulScalar(this.app.graphicsDevice.maxPixelRatio);
    let s = this.hud.screen.scale;
    const c = 0.5 * this.backing.element.width;
    this.backing.setLocalPosition(e.x / s - c, e.y / s + c, 0);
    const a = 0.5 * this.stick.element.width;
    this.stick.setLocalPosition(e.x / s - a, e.y / s + a, 0),
      (this._backingScreenPos = e),
      (this.backing.element.enabled = !0),
      (this.stick.element.enabled = !0),
      (this._fadeCountdownS = this.fadeTimeS),
      (this._fadeDirection = "in");
  }),
  (UiThumbstick.prototype.touchMove = function (t, i) {
    let e = this._stickPos;
    e.set(t, -i),
      e.mulScalar(this.app.graphicsDevice.maxPixelRatio),
      this._touchMovePos.set(t, i);
    let s = 0.5 * this.stick.element.width,
      c = this.hud.screen.scale;
    this.stick.setLocalPosition(e.x / c - s, e.y / c + s, 0);
    const a = this._backingRadius,
      n = this._touchStartPos;
    this._stickDistance = n.distance(this._touchMovePos) * this.pixelRatio;
    const h = Math.PI - Math.atan2(i - n.y, t - n.x) + Math.PI;
    if (this._stickDistance > a) {
      let t = this._backingScreenPos;
      e.set(t.x + Math.cos(h) * a, t.y + Math.sin(h) * a),
        this.stick.setLocalPosition(e.x / c - s, e.y / c + s, 0);
    }
    (UiThumbstick.touchAngleRad = h), (this._stickPos = e);
  }),
  (UiThumbstick.prototype.touchEnd = function () {
    this.backing.element.enabled &&
      "out" !== this._fadeDirection &&
      ((this._stickDistance = 0),
      (this._fadeDirection = "out"),
      this._touchStartPos.set(0, 0),
      (this._fadeCountdownS = this.fadeTimeS));
  }),
  (UiThumbstick.prototype.update = function (t) {
    let i = this._fadeCountdownS;
    if (i > 0) {
      i -= t;
      let e = this._fadeDirection;
      if (i <= 0)
        return (
          "out" === e
            ? ((this.backing.element.enabled = !1),
              (this.stick.element.enabled = !1))
            : "in" === e &&
              ((this.backing.element.opacity = this._startOpacity),
              (this.stick.element.opacity = this._startOpacity)),
          (this._fadeCountdownS = 0),
          void (this._fadeDirection = "")
        );
      const s = i / this.fadeTimeS;
      let c = 0;
      "in" === e ? (c = 1 - s) : "out" === e && (c = s),
        (c *= this._startOpacity),
        (c = pc.math.clamp(c, 0, this._startOpacity)),
        (this.stick.element.opacity = c),
        (this.backing.element.opacity = c),
        (this._fadeDirection = e),
        (this._fadeCountdownS = i);
    }
  }),
  (UiThumbstick.prototype.reset = function () {
    (this._stickDistance = 0),
      (this._fadeDirection = "out"),
      (this._fadeCountdownS = this.fadeTimeS),
      this._touchStartPos.set(0, 0),
      this._touchMovePos.set(0, 0);
  });
var ShapeKeys = pc.createScript("shapeKeys");
(ShapeKeys.prototype.initialize = function () {
  this.app.on(
    "setTopShapeKey",
    function (t, e) {
      this.setTopShapeKey(t, e);
    },
    this
  ),
    this.app.on(
      "setHairShapeKey",
      function (t, e) {
        this.setHairShapeKey(t, e);
      },
      this
    );
}),
  (ShapeKeys.prototype.setTopShapeKey = function (t, e) {
    if (!t.hasLeftGame)
      try {
        let i = t.script.outfit.selection,
          o = e
            ? this.app.itemDb.getItem(e)
            : this.app.itemDb.getItem(i.tops.selected),
          s = this.app.itemDb.getItem(i.bottoms.selected);
        if (null == o) throw new Error("Shapekey: No top found for " + e);
        if (null == s)
          throw new Error("Shapekey: No bottoms found for " + s.name);
        "Low" == s.waistHeight
          ? ((o.mesh = o.variations[0]), (i.tops.waistHeight = "Low"))
          : "Mid" == s.waistHeight
          ? ((o.mesh = o.variations[1]), (i.tops.waistHeight = "Mid"))
          : "High" == s.waistHeight
          ? ((o.mesh = o.variations[2]), (i.tops.waistHeight = "High"))
          : ((o.mesh = o.variations[0]), (i.tops.waistHeight = "Low"));
      } catch (t) {
        console.error(t);
      }
  }),
  (ShapeKeys.prototype.setHairShapeKey = function (t, e) {
    try {
      if (t.hasLeftGame) return;
      if (!t.script || !t.script.outfit) return;
      let i = t.script.outfit.selection,
        o = this.app.itemDb.getItem(e);
      if (null == o)
        return void console.error("Shapekey: No hair found for ", e);
      i.isWearingHat
        ? o.variations.length > 0 && (o.mesh = o.variations[1])
        : o.variations.length > 0 && (o.mesh = o.variations[0]);
    } catch (t) {
      console.error("Could not set hair shapekey for " + e, t);
    }
  });
var LocalizationSystem = pc.createScript("localizationSystem");
LocalizationSystem.attributes.add("locales", {
  type: "json",
  array: !0,
  schema: [
    { name: "locale", type: "string" },
    { name: "file", type: "asset", assetType: "json" },
  ],
}),
  LocalizationSystem.attributes.add("localeLabel", { type: "entity" }),
  LocalizationSystem.attributes.add("conditionals", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "langCode",
        type: "string",
        description:
          'Two letter language code, e.g. "ar" for Arabic, "fr" for French',
      },
      {
        name: "isRTL",
        type: "boolean",
        description: "Is the language right-to-left? Used for text alignment.",
      },
      {
        name: "value",
        type: "asset",
        assetType: "script",
        array: !0,
        description: "Script asset to load conditionally based on language",
      },
    ],
  }),
  (LocalizationSystem.prototype.initialize = function () {
    (this.app.i18n.locale = navigator.language || navigator.userLanguage),
      this._setLocale(this.app.i18n.locale),
      (this.localeLabel.element.text = this.app.i18n.getText(
        "Outfit",
        this.app.i18n.locale
      )),
      console.log("localization loading offscreen element");
    for (let t in this.conditionals) {
      const e = this.conditionals[t];
      if (
        this.app.i18n.locale.toLowerCase().includes(e.langCode.toLowerCase())
      ) {
        console.log(
          "Browser language is " +
            this.app.i18n.locale +
            " loading conditional scripts..."
        ),
          (this._numConditionalsToLoad = e.value.length);
        for (let t in e.value) {
          const o = e.value[t];
          console.log("Loading conditional script:", o.name),
            o.on("load", this._onConditionalLoaded.bind(this, e.isRTL)),
            this.app.assets.load(o);
        }
      }
    }
  }),
  (LocalizationSystem.prototype._onConditionalLoaded = function (t) {
    if (
      (this._numConditionalsToLoad--, 0 === this._numConditionalsToLoad && t)
    ) {
      console.log(
        "All conditional scripts loaded, adding RTL support to text elements..."
      );
      const t = this.app.root
        .findComponents("element", !0)
        .filter((t) => "text" === t.type);
      let e = 0;
      t.forEach((t) => {
        t.entity.script || t.entity.addComponent("script"),
          t.entity.script.has("rtlElement") ||
            (t.entity.script.create("rtlElement"), (e += 1));
        const o = this.app.i18n.getText(t.key, this.app.i18n.locale);
        o && o.length > 0 && (t.text = o);
      }),
        console.log("Added RTL support to " + e + " text elements.");
    }
  }),
  (LocalizationSystem.prototype._setLocale = function (t) {
    for (let e in this.locales)
      t.toLowerCase().includes(this.locales[e].locale.toLowerCase()) &&
        (!this.locales[e].file || this.locales[e].file.loaded
          ? (this.app.i18n.locale = t)
          : (this.locales[e].file.ready(
              function (e) {
                this.app.i18n.locale = t;
              }.bind(this)
            ),
            this.app.assets.load(this.locales[e].file)));
  });
var Bounce = pc.createScript("bounce");
Bounce.attributes.add("bounceTime", { type: "number", default: 1.5 }),
  Bounce.attributes.add("movementCurve", { type: "curve" }),
  Bounce.attributes.add("autoPlay", { type: "boolean", default: !0 }),
  Bounce.attributes.add("continuous", { type: "boolean", default: !0 }),
  Bounce.attributes.add("rotate", { type: "boolean", default: !1 }),
  Bounce.attributes.add("rotateSpeed", { type: "number", default: 1 }),
  Bounce.attributes.add("timeOffset", {
    type: "number",
    default: 0,
    description: "Time in ms before we call start()",
  }),
  Bounce.attributes.add("axis", {
    type: "string",
    enum: [{ X: "x" }, { Y: "y" }, { Z: "z" }],
    default: "y",
  }),
  (Bounce.prototype.initialize = function () {
    window.setVDynamic(this.entity, !0),
      this.autoPlay && this.start(),
      (this.startLocalPos = this.entity.getLocalPosition().clone());
  }),
  (Bounce.prototype.update = function (t) {
    let e = this.bounceCountdownS;
    if (e > 0) {
      e -= t;
      const o = this._getProgress(e);
      let i = this.movementCurve.value(o);
      const n = this.startLocalPos,
        s = this.axis;
      "y" == s
        ? this.entity.setLocalPosition(n.x, i, n.z)
        : "x" == s
        ? this.entity.setLocalPosition(i, n.y, n.z)
        : "z" == s && this.entity.setLocalPosition(n.x, n.y, i),
        e <= 0 && this.continuous && (e = this.bounceTime);
    }
    if (this.rotate) {
      let e = t / (1 / 60);
      this.entity.rotateLocal(0, this.rotateSpeed * e, 0);
    }
    this.bounceCountdownS = e;
  }),
  (Bounce.prototype.start = function () {
    this.bounceCountdownS = this.bounceTime;
  }),
  (Bounce.prototype.stop = function () {
    this.bounceCountdownS = 0;
  }),
  (Bounce.prototype.reset = function () {
    this.stop(),
      this.entity.setLocalPosition(this.startLocalPos),
      this.rotate && this.entity.setLocalEulerAngles(0, 0, 0);
  }),
  (Bounce.prototype._getProgress = function (t) {
    let e = (t += this.timeOffset) / this.bounceTime;
    return e > 1 ? (e %= 1) : e < 0 && (e = 1 - Math.abs(e % 1)), 1 - e;
  });
var EnvironmentItem = pc.createScript("environmentItem");
EnvironmentItem.attributes.add("material", { type: "asset" }),
  EnvironmentItem.attributes.add("ogOffset", {
    type: "vec2",
    description: "For reset",
  }),
  EnvironmentItem.attributes.add("ogColor", {
    type: "string",
    description: "For initial color db lookup",
  }),
  (EnvironmentItem.prototype.initialize = function () {
    this.entity.button.on(
      "click",
      () => {
        this.setActiveItem(), this.app.fire("sound:pop:pitch1");
      },
      this
    );
  }),
  (EnvironmentItem.prototype.setActiveItem = function () {
    let t = this.app.globals;
    this.app.environmentColorSystem.items.forEach((t) => {
      t && (t.element.color = this.app.uiColors.inactive);
    }),
      (this.entity.element.color = this.app.uiColors.pink),
      (t.activeItem = this.entity.name),
      t.env[this.entity.name]
        ? this.app.fire("setColorSelectedState", t.env[this.entity.name])
        : this.app.fire("setColorSelectedState", this.ogColor);
  });
var ResetRoom = pc.createScript("resetRoom");
(ResetRoom.prototype.initialize = function () {
  (this._firstRoomReset = !1),
    this.entity.button.on(
      "click",
      function () {
        this.resetRoom();
      },
      this
    );
}),
  (ResetRoom.prototype.resetRoom = function () {
    this.app.fire("longChimes"),
      this.app.environmentColorSystem.items.forEach(function (t) {
        try {
          let e = t.script.environmentItem.ogOffset;
          t.script.environmentItem.material.resource.diffuseMapOffset.set(
            e.x,
            e.y
          ),
            t.script.environmentItem.material.resource.update();
        } catch (e) {
          console.error("Issue reseting environment item: " + t, e);
        }
      }, this),
      this.app.saveStats("env", this.app.globals.env),
      !1 === this._firstRoomReset &&
        ((this._firstRoomReset = !0),
        this.app.fire("watcher:track", "first_room_reset"));
  });
var FrameTracker = pc.createScript("frameTracker");
(FrameTracker.num = 0),
  (FrameTracker.prototype.update = function () {
    FrameTracker.num++;
  });
var GameServer = pc.createScript("gameServer");
GameServer.attributes.add("serverUrl", {
  enum: [
    { "Prod LB": "lb.v1digital.com" },
    { "Local LB": "localhost:8787" },
    { "Local Server": "local.v1digital.com:3000" },
    { "Development Server": "vortellas-dev.v1digital.com" },
  ],
  default: "vortellas-dev.v1digital.com",
  type: "string",
}),
  GameServer.attributes.add("localPlayer", { type: "entity" }),
  GameServer.attributes.add("remotePlayer", {
    type: "asset",
    assetType: "template",
  }),
  GameServer.attributes.add("remotePlayerGroup", { type: "entity" }),
  GameServer.attributes.add("numClientsHud", { type: "entity" }),
  GameServer.attributes.add("globalPlayerCountHud", { type: "entity" }),
  (GameServer.prototype.initialize = function () {
    (this.app.networkCodes = {
      PING: 0,
      LOCAL_CONNECT: 1,
      PLAYER_STATE: 2,
      REMOTE_CONNECT: 3,
      REMOTE_DISCONNECT: 4,
      REMOTE_UPDATE: 5,
      OUTFIT_UPDATE: 6,
      COMMUNICATION: 7,
      INSTANCE_STATE: 8,
      PLAYER_AREA: 9,
      TIMER: 10,
      INSTANCE_CHANGE: 11,
      COMPETITION: 12,
      LOCAL_DISCONNECT: 13,
    }),
      (this.app.remotePlayers = {}),
      (this.app.server = {
        clientId: 0,
        url: "",
        numClients: 0,
        socket: null,
        isConnected: !1,
        disconnectionReason: "",
        send: this._send.bind(this),
      }),
      this.app.on("network:create:room", this._createRoom, this),
      this.app.on("network:leave:room", this._leaveRoom, this),
      this.app.on("network:join:room", this._joinRoom, this),
      this.app.on("instance:change", this._clearRemotePlayers, this),
      -1 == window.location.href.indexOf("playcanv") &&
        (this.serverUrl = "lb.v1digital.com"),
      (this.app.serverUrl = this.serverUrl),
      (this.app.serverProtocol = "https://"),
      (this._connectionInProgress = !1),
      (this._numReconnectAttempts = 0),
      (this._lastConnectionAttemptAt = 0),
      (this._atLeastOneSuccessfulConnection = !1),
      console.log("server url is: " + this.serverUrl);
    const e = this._getForcedConnectionUrl();
    e ? this._connectTo(e) : this._initiateConnection();
  }),
  (GameServer.prototype._send = function (e) {
    const t = this.app.server;
    if (t && t.socket && t.socket.readyState === WebSocket.OPEN)
      try {
        t.socket.send(e);
      } catch (e) {
        console.log("Failed to send message", e);
      }
  }),
  (GameServer.prototype._initiateConnection = function () {
    if (
      ((this._connectionInProgress = !0),
      "lb.v1digital.com" == this.serverUrl ||
        "localhost:8787" == this.serverUrl)
    ) {
      this.serverUrl.indexOf("localhost") > -1 &&
        (this.app.serverProtocol = "http://");
      const e = PokiSDK.getURLParam("roomCode");
      e.length > 0
        ? (this.app.fire("watcher:track", "onload_room_code_detected"),
          this._joinRoom(e, () => {}, this._findPublicRoom.bind(this)))
        : this._findPublicRoom();
    } else
      this.app.fire("watcher:track", "direct_connection_attempt"),
        this._connectTo(this.serverUrl);
  }),
  (GameServer.prototype.update = function (e) {
    if (
      !(
        (this.app.server && this.app.server.isConnected) ||
        this._connectionInProgress
      ) &&
      this.app.inputState.pressingAny
    ) {
      pc.now() - this._lastConnectionAttemptAt >
        3e3 * this._numReconnectAttempts &&
        (this._initiateConnection(),
        (this._numReconnectAttempts += 1),
        (this._lastConnectionAttemptAt = pc.now()));
    }
  }),
  (GameServer.prototype._findPublicRoom = function (e = null) {
    this.app.fire("watcher:track", "finding_a_public_instance");
    let t = new XMLHttpRequest();
    const o = "?version=" + window.gameVersion;
    t.open(
      "GET",
      this.app.serverProtocol + this.serverUrl + "/find-public-instance" + o,
      !0
    ),
      (t.onreadystatechange = function () {
        if (t.readyState === XMLHttpRequest.DONE)
          if (200 === t.status) {
            const o = JSON.parse(t.responseText);
            this.app.fire("watcher:track", "instance_response_received"),
              o.url.length > 0
                ? (this.app.fire("watcher:track", "valid_instance_found"),
                  (this.globalPlayerCountHud.element.text =
                    "Online " + o.online.toLocaleString()),
                  this._connectTo(o.url + "/" + o.instanceId, e))
                : (this.app.fire("watcher:track", "no_valid_instance_found"),
                  (this._connectionInProgress = !1));
          } else
            console.error("Failed to get server url from load balancer"),
              (this._connectionInProgress = !1);
      }.bind(this)),
      t.send();
  }),
  (GameServer.prototype._connectTo = function (e, t = null) {
    try {
      console.log("Connecting to " + e),
        this.app.fire("watcher:track", "websocket_connection_attempt");
      let t = this.socket;
      throw new Error();
      t &&
        (console.log("Closing existing socket, removing event listeners"),
        t.removeEventListener("open", this._onOpen.bind(this)),
        t.removeEventListener("message", this._onMessage.bind(this)),
        t.removeEventListener("error", this._onError.bind(this)),
        t.removeEventListener("close", this._onClose.bind(this)),
        t.close(1e3, "Reconnecting"),
        (t = null)),
        (t = new WebSocket("wss://" + e)),
        (t.binaryType = "arraybuffer"),
        (this.app.server.socket = t),
        (this.app.server.url = e),
        t.addEventListener("open", this._onOpen.bind(this)),
        t.addEventListener("message", this._onMessage.bind(this)),
        t.addEventListener("error", this._onError.bind(this)),
        t.addEventListener("close", this._onClose.bind(this)),
        (this.socket = t);
    } catch (e) {
      console.error("Failed to create WebSocket", e),
        (this._connectionInProgress = !1),
        this.app.fire("watcher:track", "websocket_connection_attempt_failed");
    }
  }),
  (GameServer.prototype._onOpen = function (e) {
    console.log("Successfully connected to ", this.socket.url),
      this._clearRemotePlayers(),
      this.app.fire("watcher:track", "websocket_connection_successful"),
      (this._atLeastOneSuccessfulConnection = !0),
      (this.app.server.isConnected = !0),
      (this._connectionInProgress = !1),
      (this._numReconnectAttempts = 0),
      this.app.fire("server:connected"),
      "function" == typeof successCallback && successCallback();
  }),
  (GameServer.prototype._onMessage = function (e) {
    const t = this._decodeMessage(e.data);
    for (let e in t) {
      if (t[e].length <= 0) continue;
      let o = t[e];
      for (let e = 0; e < o.length; e++) this._processPacket(o[e]);
    }
  }),
  (GameServer.prototype._onError = function (e) {
    (this._connectionInProgress = !1),
      (this.app.server.isConnected = !1),
      this.app.fire("watcher:track", "websocket_connection_on_error");
    const t = this.app.server.url;
    t.indexOf("io-8.com") > -1
      ? (console.log(
          "Default io-8.com URL failed, we will try vortellas-backup.v1digital.com"
        ),
        this._connectTo("vortellas-backup.v1digital.com"))
      : t.indexOf("v1digital.com") > -1 &&
        console.error(
          "Failed to connect to both *.io-8.com and *.v1digital.com URLs"
        );
  }),
  (GameServer.prototype._onClose = function (e) {
    (this._connectionInProgress = !1),
      (this.app.server.isConnected = !1),
      this.app.fire("server:disconnected"),
      this._clearRemotePlayers(),
      this.app.fire("watcher:track", "websocket_connection_closed"),
      console.log("Disconnected from the WebSocket server"),
      !1 === e.wasClean &&
        e.reason.length <= 0 &&
        "" == this.app.server.disconnectionReason &&
        !1 === this._atLeastOneSuccessfulConnection &&
        console.error("WebSocket closed wasClean: false, no reason provided");
  }),
  (GameServer.prototype._decodeMessage = function (e) {
    try {
      return MessagePack.decode(e);
    } catch (e) {
      console.error("Failed to decode message", e);
    }
  }),
  (GameServer.prototype._processPacket = function (e) {
    try {
      const t = this.app.networkCodes,
        o = e[0];
      if (o == t.REMOTE_UPDATE) {
        let t = this.app.remotePlayers[e[1]];
        t && !1 === t.hasLeftGame && t.script.remotePlayer.applyStateUpdate(e);
      } else if (o == t.TIMER) this.app.timers.applyUpdate(e);
      else if (o == t.INSTANCE_STATE) {
        const t = e[1],
          o = t[0][0][1];
        if (
          ((this.app.server.numClients = o),
          (this.numClientsHud.element.text = this.app.server.numClients),
          t.length > 1)
        ) {
          const e = t[1];
          let o = e[0][1],
            s = e[1][1];
          if (t.length >= 4) {
            const e = this.app.i18n.locale.toLowerCase();
            for (let s = 0; s < t[2].length; s += 2) {
              const r = t[2][s][1].toLowerCase();
              if (e.includes(r)) {
                (this.app.competition.themeTranslations[o] = t[2][s + 1][1]),
                  (o = t[2][s + 1][1]);
                break;
              }
            }
            for (let o = 0; o < t[3].length; o += 2) {
              const r = t[3][o][1].toLowerCase();
              if (e.includes(r)) {
                (this.app.competition.themeTranslations[s] = t[3][o + 1][1]),
                  (s = t[3][o + 1][1]);
                break;
              }
            }
            this.app.themeVoting.updateThemes(o, s);
          } else this.app.themeVoting.updateAndLocalizeThemes(o, s);
        }
      } else if (o == t.LOCAL_CONNECT)
        (this.app.server.clientId = e[1]),
          (this.app.globals.localPlayer.clientId = this.app.server.clientId),
          console.log(
            "Local player has been assigned player id " +
              this.app.server.clientId
          );
      else if (o == t.LOCAL_DISCONNECT)
        (this.app.server.isConnected = !1),
          (this.app.server.disconnectionReason = e[1]),
          console.log(
            "Local disconnect! Reason: " + this.app.server.disconnectionReason
          );
      else if (o == t.REMOTE_CONNECT) {
        const t = e[1];
        for (let e in t) {
          if (this.app.remotePlayers[t[e]]) continue;
          let o = this.remotePlayer.resource.instantiate();
          this.remotePlayerGroup.addChild(o),
            (o.name = "player-" + t[e]),
            (o.isRemote = !0),
            (o.clientId = parseInt(t[e])),
            o.script.remotePlayer.hide(),
            (this.app.remotePlayers[t[e]] = o),
            this.app.fire("remote:player:connect", o);
        }
      } else if (o == t.REMOTE_DISCONNECT) {
        const t = e[1];
        for (let e in t) {
          let o = this.app.remotePlayers[t[e]];
          o &&
            (o.fire("disconnect"),
            this.remotePlayerGroup.removeChild(o),
            this.app.fire("remote:player:disconnect", o),
            delete this.app.remotePlayers[t[e]],
            o.destroy());
        }
      } else if (o == t.PLAYER_AREA) {
        let t = this.app.remotePlayers[e[1]];
        t && t.script.playerArea.applyUpdate(e);
      } else if (o == t.OUTFIT_UPDATE) {
        let t = this.app.remotePlayers[e[1]];
        t && t.script.outfit.applyUpdate(e);
      } else if (o == t.COMMUNICATION)
        if (e.length >= 3 && e[2].length > 0 && 4 == e[2][0][1])
          this.app.chat.processServerMessage(e);
        else {
          let t = this.app.remotePlayers[e[1]];
          t && t.script.remotePlayer.applyCommunicationUpdate(e);
        }
      else
        o == t.INSTANCE_CHANGE
          ? this.app.instance.applyUpdate(e)
          : o == t.COMPETITION && this.app.competition.applyUpdate(e);
    } catch (t) {
      console.log("Failed to process packet ", t), console.log(e);
    }
  }),
  (GameServer.prototype._clearRemotePlayers = function () {
    for (let e = this.remotePlayerGroup.children.length - 1; e >= 0; e--) {
      let t = this.remotePlayerGroup.children[e];
      this.remotePlayerGroup.removeChild(t), t.destroy();
    }
    this.app.remotePlayers = {};
  }),
  (GameServer.prototype._createRoom = function (e) {
    console.log("Creating a room..."),
      this.app.fire("watcher:track", "creating_a_room");
    let t = new XMLHttpRequest();
    t.open(
      "GET",
      this.app.serverProtocol + this.app.serverUrl + "/reserve-instance",
      !0
    ),
      (t.onreadystatechange = function () {
        if (t.readyState === XMLHttpRequest.DONE)
          if (200 === t.status) {
            const o = JSON.parse(t.responseText);
            this.app.fire("watcher:track", "create_room_response_received"),
              o.url.length > 0
                ? (this.app.fire("watcher:track", "room_successfully_created"),
                  (this.app.globals.customRoomCode = o.shortId),
                  this._switchServer(o.url + "/" + o.instanceId),
                  e())
                : this.app.fire(
                    "watcher:track",
                    "failed_to_create_room_" + o.message
                  );
          } else console.error("Failed to create room");
      }.bind(this)),
      t.send();
  }),
  (GameServer.prototype._switchServer = function (e) {
    console.log("Switching server to " + e),
      this.app.server &&
        this.app.server.isConnected &&
        (console.log("Disconnecting from current server"),
        this.socket.close(1e3, "Switching server")),
      console.log("Connecting to new server " + e),
      this._connectTo(e);
  }),
  (GameServer.prototype._leaveRoom = function (e) {
    console.log("Leaving current room"),
      this.app.server.isConnected &&
        (console.log("Disconnecting from current server"),
        this.socket.close(1e3, "Leaving room"),
        e()),
      this._findPublicRoom(e);
  }),
  (GameServer.prototype._joinRoom = function (e, t, o) {
    console.log("Joining room " + e),
      this.app.fire("watcher:track", "joining_a_room");
    let s = new XMLHttpRequest();
    s.open(
      "GET",
      this.app.serverProtocol +
        this.app.serverUrl +
        "/find-reserved-instance?id=" +
        e,
      !0
    ),
      (s.onreadystatechange = function () {
        if (s.readyState === XMLHttpRequest.DONE)
          if (200 === s.status) {
            const r = JSON.parse(s.responseText);
            this.app.fire("watcher:track", "join_room_response_received"),
              r.url.length > 0
                ? (this.app.fire("watcher:track", "join_room_found"),
                  (this.app.globals.customRoomCode = e),
                  this._switchServer(r.url + "/" + r.instanceId),
                  "function" == typeof t && t())
                : (this.app.fire(
                    "watcher:track",
                    "failed_to_join_room_" + r.message
                  ),
                  o && o(r.message));
          } else console.error("Failed to create room");
      }.bind(this)),
      s.send();
  }),
  (GameServer.prototype._getForcedConnectionUrl = function () {
    const e = new URLSearchParams(window.location.search),
      t = e.get("forceUrl"),
      o = e.get("forceId");
    return t
      ? (console.log("Force URL detected: " + t),
        o ? (console.log("Force Instance ID detected: " + o), t + "/" + o) : t)
      : "";
  });
var LocalPlayer = pc.createScript("localPlayer");
LocalPlayer.attributes.add("frequency", {
  type: "number",
  default: 6,
  description:
    "How many times per second this entity will send its state to the server",
}),
  LocalPlayer.attributes.add("playerMesh", { type: "entity" }),
  LocalPlayer.attributes.add("thumbstick", { type: "entity" }),
  LocalPlayer.attributes.add("playerNameElement", { type: "entity" }),
  LocalPlayer.attributes.add("vipIcon", { type: "entity" }),
  (LocalPlayer.prototype.initialize = function () {
    (this.entity.createdAt = pc.now()),
      (this.entity.isLocalPlayer = !0),
      (this.entity.isRemotePlayer = !1),
      (this.entity.positionOverrideActive = !1),
      (this.vipIcon.element.drawOrder = -100),
      (this.timer = 0),
      (this.forward = new pc.Vec3()),
      (this.uiThumbstick = this.thumbstick.script.uiThumbstick),
      this.app.on("menu:close", this._onMenuClose, this),
      this.app.on("outfit:transmit", this._transmitOutfit, this),
      this.app.on("server:connected", this._transmitInitialState, this),
      this.app.on("station:enter", this._onStationEnter, this),
      this.app.on("station:exit", this._onStationExit, this),
      this.app.on("vip:access:granted", this._onVIPAccessChange, this),
      this.app.on("vip:access:expired", this._onVIPAccessChange, this);
  }),
  (LocalPlayer.prototype.postInitialize = function () {
    this.entity.setPosition(this.app.spawnSystem.getSpawnPosition());
  }),
  (LocalPlayer.prototype.update = function (t) {
    this.timer += t;
    const e = 1 / this.frequency;
    this.timer >= e && ((this.timer -= e), this.transmitCurrentState());
  }),
  (LocalPlayer.prototype.transmitCurrentState = function () {
    const t = this.entity.getPosition(),
      e = this.entity.getRotation();
    let o = this.forward;
    e.transformVector(pc.Vec3.FORWARD, o);
    const s = Math.atan2(-o.x, -o.z) * (180 / Math.PI),
      a = [
        this.app.networkCodes.PLAYER_STATE,
        [
          [
            [1, parseInt(pc.now())],
            [1, parseInt(s)],
            [1, parseInt(100 * t.x)],
            [1, parseInt(100 * t.y)],
            [1, parseInt(100 * t.z)],
            [1, parseInt(100 * this._getInputPercentage())],
            [0, this.app.inputState.isJumpInProgress],
            [1, this.app.globals.localCharAnims.anim.getInteger("pose")],
          ],
        ],
      ];
    this.app.server.send(MessagePack.encode(a));
  }),
  (LocalPlayer.prototype._getInputPercentage = function () {
    return this.uiThumbstick.hasInput()
      ? this.uiThumbstick.getInputPercentage()
      : this.app.inputState.isUsingKeyboardToMove()
      ? 1
      : 0;
  }),
  (LocalPlayer.prototype._onMenuClose = function () {
    (this.app.globals.outfitWasChanged ||
      this.app.globals.playerNameWasChanged) &&
      (this._transmitOutfit(),
      (this.app.globals.outfitWasChanged = !1),
      (this.app.globals.playerNameWasChanged = !1));
  }),
  (LocalPlayer.prototype._onStationEnter = function () {
    this.playerNameElement.enabled = !1;
  }),
  (LocalPlayer.prototype._onStationExit = function () {
    (this.playerNameElement.enabled = !0),
      this.app.globals.outfitWasChanged &&
        (this._transmitOutfit(), (this.app.globals.outfitWasChanged = !1));
  }),
  (LocalPlayer.prototype._transmitInitialState = function () {
    const t = this.app.server;
    t && t.isConnected
      ? (this._transmitPlayerName(), this._transmitOutfit())
      : this.app.once("server:connected", this._transmitInitialState, this);
  }),
  (LocalPlayer.prototype._onVIPAccessChange = function () {
    this.app.vipRoom.hasAccess()
      ? (this.vipIcon.enabled = !0)
      : (this.vipIcon.enabled = !1),
      this._transmitNameIcons();
  }),
  (LocalPlayer.prototype._transmitNameIcons = function () {
    const t = [
      this.app.networkCodes.COMMUNICATION,
      [
        [
          [1, 5],
          [3, this.app.vipRoom.hasAccess() ? "vip" : ""],
        ],
      ],
    ];
    this.app.server.send(MessagePack.encode(t));
  }),
  (LocalPlayer.prototype._transmitOutfit = function () {
    const t = this.app.globals.localOutfit.selection;
    if (t) {
      const e = [
        [
          [0, t.isWearingDress],
          [0, t.isWearingHat],
          [3, this.app.globals.playerName],
        ],
        [
          [1, this._packColor(t.body.selectedSkinColor)],
          [1, this._packColor(t.body.selectedSkinShadingColor)],
          [1, this._packColor(t.body.selectedEyeColor)],
          [1, this._packColor(t.body.selectedLipColor)],
          [1, this._packColor(t.body.selectedBlushColor)],
        ],
        [
          [3, t.hair.selected],
          [1, this._packColor(t.hair.selectedHairColor)],
          [1, this._packColor(t.hair.selectedHairShadingColor)],
          [1, this._packColor(t.hair.selectedEyebrowColor)],
        ],
        [[3, t.eyes.selected]],
        [[3, t.cheek.selected]],
        [[3, t.lips.selected]],
        [
          [3, t.tops.selected],
          [3, t.tops.color1],
          [3, t.tops.color2],
          [3, t.tops.color3],
          [3, t.tops.waistHeight],
        ],
        [
          [3, t.dresses.selected],
          [3, t.dresses.color1],
          [3, t.dresses.color2],
          [3, t.dresses.color3],
        ],
        [
          [3, t.bottoms.selected],
          [3, t.bottoms.color1],
          [3, t.bottoms.color2],
          [3, t.bottoms.color3],
        ],
        [
          [3, t.shoes.selected],
          [3, t.shoes.color1],
          [3, t.shoes.color2],
          [3, t.shoes.color3],
        ],
        [
          [3, t.hats.selected],
          [3, t.hats.color1],
          [3, t.hats.color2],
          [3, t.hats.color3],
        ],
        [
          [3, t.belts.selected],
          [3, t.belts.color1],
          [3, t.belts.color2],
          [3, t.belts.color3],
        ],
        [
          [3, t.glasses.selected],
          [3, t.glasses.color1],
          [3, t.glasses.color2],
          [3, t.glasses.color3],
        ],
        [
          [3, t.bags.selected],
          [3, t.bags.color1],
          [3, t.bags.color2],
          [3, t.bags.color3],
        ],
        [
          [3, t.coats.selected],
          [3, t.coats.color1],
          [3, t.coats.color2],
          [3, t.coats.color3],
        ],
        [
          [3, t.neck.selected],
          [3, t.neck.color1],
          [3, t.neck.color2],
          [3, t.neck.color3],
        ],
        [
          [3, t.ear.selected],
          [3, t.ear.color1],
          [3, t.ear.color2],
          [3, t.ear.color3],
        ],
        [
          [3, t.wrist.selected],
          [3, t.wrist.color1],
          [3, t.wrist.color2],
          [3, t.wrist.color3],
        ],
        [
          [3, t.headAccs.selected],
          [3, t.headAccs.color1],
          [3, t.headAccs.color2],
          [3, t.headAccs.color3],
        ],
        [
          [3, t.handhelds.selected],
          [3, t.handhelds.color1],
          [3, t.handhelds.color2],
          [3, t.handhelds.color3],
        ],
        [
          [3, t.back.selected],
          [3, t.back.color1],
          [3, t.back.color2],
          [3, t.back.color3],
        ],
      ];
      this.app.server.send(
        MessagePack.encode([this.app.networkCodes.OUTFIT_UPDATE, e])
      );
    }
  }),
  (LocalPlayer.prototype._packColor = function (t) {
    if (
      !t ||
      void 0 === t.r ||
      void 0 === t.g ||
      void 0 === t.b ||
      void 0 === t.a
    )
      return -1;
    return (
      ((255 & Math.round(255 * t.r)) << 24) |
      ((255 & Math.round(255 * t.g)) << 16) |
      ((255 & Math.round(255 * t.b)) << 8) |
      (255 & Math.round(255 * t.a))
    );
  }),
  (LocalPlayer.prototype._transmitPlayerName = function () {
    const t = [
      this.app.networkCodes.COMMUNICATION,
      [
        [
          [1, 1],
          [3, this.app.globals.playerName],
        ],
      ],
    ];
    this.app.server.send(MessagePack.encode(t)),
      (this.app.globals.playerNameWasChanged = !1);
  }),
  (LocalPlayer.prototype.hide = function () {
    (this.playerMesh.enabled = !1), (this.playerNameElement.enabled = !1);
  }),
  (LocalPlayer.prototype.show = function () {
    (this.playerMesh.enabled = !0), (this.playerNameElement.enabled = !0);
  }),
  (LocalPlayer.prototype.isHidden = function () {
    return !this.playerMesh.enabled && !this.playerNameElement.enabled;
  });
var Outfit = pc.createScript("outfit");
Outfit.attributes.add("playerMesh", { type: "entity" }),
  Outfit.attributes.add("effectsPlane", { type: "entity" }),
  (Outfit.prototype.initialize = function () {
    (this._forceBodyColorSlots = ["lipSlot", "eyeSlot", "cheekSlot"]),
      (this.playerMaterials = this.entity.script.materialTracker),
      (this.isLocalPlayer =
        this.entity.getGuid() == this.app.globals.localPlayer.getGuid()),
      (this._effectPlaneLocalPos = this.effectsPlane
        .getLocalPosition()
        .clone()),
      (this._wearItemQueue = []),
      (this._firstSwapFromDress = !0),
      (this.selection = {
        version: "1",
        isWearingDress: !0,
        isWearingHat: !1,
        body: {
          selectedSkinColor: new pc.Color(0.85, 0.67, 0.537, 1),
          selectedSkinShadingColor: new pc.Color(0.796, 0.567, 0.443, 1),
          selectedEyeColor: new pc.Color(0.349, 0.247, 0.207, 1),
          selectedLipColor: new pc.Color(0.768, 0.529, 0.4, 1),
          selectedBlushColor: new pc.Color(0.768, 0.529, 0.4, 1),
        },
        hair: {
          selected: "hairTowel",
          selectedHairColor: new pc.Color(0.466, 0.325, 0.27, 1),
          selectedHairShadingColor: new pc.Color(0.349, 0.247, 0.207, 1),
          selectedEyebrowColor: new pc.Color(0.349, 0.247, 0.207, 1),
        },
        eyes: { selected: "defaultEyes" },
        cheek: { selected: "freckles" },
        lips: { selected: "defaultLips" },
        tops: {
          selected: "undershirt",
          color1: "white",
          color2: "white",
          color3: "white",
          waistHeight: "Low",
        },
        dresses: {
          selected: "robe",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        bottoms: {
          selected: "bareleg",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        shoes: {
          selected: "barefoot",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        hats: {
          selected: "hatNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        belts: {
          selected: "beltNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        glasses: {
          selected: "glassesNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        bags: {
          selected: "bagsNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        coats: {
          selected: "coatsNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        neck: {
          selected: "neckNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        ear: {
          selected: "earNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        wrist: {
          selected: "wristNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        headAccs: {
          selected: "headAccsNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        handhelds: {
          selected: "handheldNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
        back: {
          selected: "backNone",
          color1: "white",
          color2: "white",
          color3: "white",
        },
      }),
      this.on("destroy", () => {
        this._wearItemQueue = [];
      });
  }),
  (Outfit.prototype._isVisible = function () {
    return (
      !this.entity.hasLeftGame &&
      (!this.entity.isLocalPlayer ||
        !this.entity.script.localPlayer.isHidden()) &&
      (!this.entity.isRemotePlayer ||
        !this.entity.script.remotePlayer.isHidden()) &&
      this.entity.enabled
    );
  }),
  (Outfit.prototype.applyUpdate = function (e) {
    if (!e) return;
    if (this.entity.hasLeftGame) return;
    const t = this._unpackOutfit(e[2]);
    let s = this.selection;
    s &&
      (this.setDressState(t.flags[0][1]),
      (s.isWearingHat = t.flags[1][1]),
      t.flags[2] &&
        t.flags[2][1].length > 0 &&
        this.entity.isRemotePlayer &&
        this.entity.script.remotePlayer.setName(t.flags[2][1]),
      (s.body.selectedSkinColor = this._unpackColor(t.bodyColor[0][1])),
      (s.body.selectedSkinShadingColor = this._unpackColor(t.bodyColor[1][1])),
      (s.body.selectedEyeColor = this._unpackColor(t.bodyColor[2][1])),
      (s.body.selectedLipColor = this._unpackColor(t.bodyColor[3][1])),
      (s.body.selectedBlushColor = this._unpackColor(t.bodyColor[4][1])),
      (s.hair.selected = t.hair[0][1]),
      (s.hair.selectedHairColor = this._unpackColor(t.hair[1][1])),
      (s.hair.selectedHairShadingColor = this._unpackColor(t.hair[2][1])),
      (s.hair.selectedEyebrowColor = this._unpackColor(t.hair[3][1])),
      this._updateBodyMaterials(),
      this.wearItem("hairSlot", s.hair),
      (s.eyes.selected = t.eyes[0][1]),
      (s.cheek.selected = t.cheek[0][1]),
      (s.lips.selected = t.lips[0][1]),
      this.wearItem("eyeSlot", s.eyes),
      this.wearItem("cheekSlot", s.cheek),
      this.wearItem("lipSlot", s.lips),
      (s.tops.selected = t.tops[0][1]),
      (s.tops.color1 = t.tops[1][1]),
      (s.tops.color2 = t.tops[2][1]),
      (s.tops.color3 = t.tops[3][1]),
      (s.tops.waistHeight = t.tops[4][1]),
      this.wearItem("topSlot", s.tops),
      (s.bottoms.selected = t.bottoms[0][1]),
      (s.bottoms.color1 = t.bottoms[1][1]),
      (s.bottoms.color2 = t.bottoms[2][1]),
      (s.bottoms.color3 = t.bottoms[3][1]),
      this.wearItem("bottomSlot", s.bottoms),
      (s.dresses.selected = t.dresses[0][1]),
      (s.dresses.color1 = t.dresses[1][1]),
      (s.dresses.color2 = t.dresses[2][1]),
      (s.dresses.color3 = t.dresses[3][1]),
      s.isWearingDress && this.wearItem("dressSlot", s.dresses),
      (s.shoes.selected = t.shoes[0][1]),
      (s.shoes.color1 = t.shoes[1][1]),
      (s.shoes.color2 = t.shoes[2][1]),
      (s.shoes.color3 = t.shoes[3][1]),
      this.wearItem("shoeSlot", s.shoes),
      (s.hats.selected = t.hats[0][1]),
      (s.hats.color1 = t.hats[1][1]),
      (s.hats.color2 = t.hats[2][1]),
      (s.hats.color3 = t.hats[3][1]),
      this.wearItem("hatSlot", s.hats),
      (s.belts.selected = t.belts[0][1]),
      (s.belts.color1 = t.belts[1][1]),
      (s.belts.color2 = t.belts[2][1]),
      (s.belts.color3 = t.belts[3][1]),
      this.wearItem("beltSlot", s.belts),
      (s.glasses.selected = t.glasses[0][1]),
      (s.glasses.color1 = t.glasses[1][1]),
      (s.glasses.color2 = t.glasses[2][1]),
      (s.glasses.color3 = t.glasses[3][1]),
      this.wearItem("glassesSlot", s.glasses),
      (s.bags.selected = t.bags[0][1]),
      (s.bags.color1 = t.bags[1][1]),
      (s.bags.color2 = t.bags[2][1]),
      (s.bags.color3 = t.bags[3][1]),
      this.wearItem("bagSlot", s.bags),
      (s.coats.selected = t.coats[0][1]),
      (s.coats.color1 = t.coats[1][1]),
      (s.coats.color2 = t.coats[2][1]),
      (s.coats.color3 = t.coats[3][1]),
      this.wearItem("coatSlot", s.coats),
      (s.neck.selected = t.neck[0][1]),
      (s.neck.color1 = t.neck[1][1]),
      (s.neck.color2 = t.neck[2][1]),
      (s.neck.color3 = t.neck[3][1]),
      this.wearItem("neckSlot", s.neck),
      (s.ear.selected = t.ear[0][1]),
      (s.ear.color1 = t.ear[1][1]),
      (s.ear.color2 = t.ear[2][1]),
      (s.ear.color3 = t.ear[3][1]),
      this.wearItem("earSlot", s.ear),
      (s.wrist.selected = t.wrist[0][1]),
      (s.wrist.color1 = t.wrist[1][1]),
      (s.wrist.color2 = t.wrist[2][1]),
      (s.wrist.color3 = t.wrist[3][1]),
      this.wearItem("wristSlot", s.wrist),
      t.headAccs &&
        ((s.headAccs.selected = t.headAccs[0][1]),
        (s.headAccs.color1 = t.headAccs[1][1]),
        (s.headAccs.color2 = t.headAccs[2][1]),
        (s.headAccs.color3 = t.headAccs[3][1]),
        this.wearItem("headAccsSlot", s.headAccs)),
      t.handhelds &&
        ((s.handhelds.selected = t.handhelds[0][1]),
        (s.handhelds.color1 = t.handhelds[1][1]),
        (s.handhelds.color2 = t.handhelds[2][1]),
        (s.handhelds.color3 = t.handhelds[3][1]),
        this.wearItem("handheldSlot", s.handhelds)),
      t.back &&
        ((s.back.selected = t.back[0][1]),
        (s.back.color1 = t.back[1][1]),
        (s.back.color2 = t.back[2][1]),
        (s.back.color3 = t.back[3][1]),
        this.wearItem("backSlot", s.back)));
  }),
  (Outfit.prototype._unpackOutfit = function (e) {
    if (!(e.length < 18))
      return {
        flags: e[0],
        bodyColor: e[1],
        hair: e[2],
        eyes: e[3],
        cheek: e[4],
        lips: e[5],
        tops: e[6],
        dresses: e[7],
        bottoms: e[8],
        shoes: e[9],
        hats: e[10],
        belts: e[11],
        glasses: e[12],
        bags: e[13],
        coats: e[14],
        neck: e[15],
        ear: e[16],
        wrist: e[17],
        headAccs: e[18],
        handhelds: e[19],
        back: e[20],
      };
    console.error("   We dont have enough outfit data");
  }),
  (Outfit.prototype._unpackColor = function (e) {
    return {
      r: ((e >> 24) & 255) / 255,
      g: ((e >> 16) & 255) / 255,
      b: ((e >> 8) & 255) / 255,
      a: (255 & e) / 255,
    };
  }),
  (Outfit.prototype.setDressState = function (e) {
    if (this.entity.hasLeftGame) return;
    (this.selection.isWearingDress = e),
      e
        ? this.app.afterGroupLoaded("dressSlot", () => {
            (this.entity.findByName("dressSlot").enabled = !0),
              (this.entity.findByName("topSlot").enabled = !1),
              (this.entity.findByName("bottomSlot").enabled = !1);
          })
        : this.app.afterGroupsLoaded(["topSlot", "bottomSlot"], () => {
            (this.entity.findByName("dressSlot").enabled = !1),
              (this.entity.findByName("topSlot").enabled = !0),
              (this.entity.findByName("bottomSlot").enabled = !0);
          });
    let t = e ? this.selection.dresses.selected : this.selection.tops.selected;
    this.setCustomArms(t);
  }),
  (Outfit.prototype.setCustomArms = function (e) {
    if (this.entity.hasLeftGame) return;
    let t = this.app.itemDb.getItem(e);
    this.entity.findByName("char.arms").enabled = !t.customArm;
  }),
  (Outfit.prototype._updateBodyMaterials = function () {
    const updateMaterial = (e, t) => {
      e.diffuse.set(t.r, t.g, t.b), e.update();
    };
    let e = this.selection;
    const t = this.playerMaterials;
    updateMaterial(t.skinMaterial, e.body.selectedSkinColor),
      updateMaterial(t.skinShadingMaterial, e.body.selectedSkinShadingColor),
      updateMaterial(t.hairMaterial, e.hair.selectedHairColor),
      updateMaterial(t.hairShadingMaterial, e.hair.selectedHairShadingColor),
      updateMaterial(t.eyeMaterial, e.body.selectedEyeColor),
      updateMaterial(t.lipMaterial, e.body.selectedLipColor),
      updateMaterial(t.blushMaterial, e.body.selectedBlushColor);
  }),
  (Outfit.prototype.update = function (e) {
    this.effectsPlane.enabled &&
      this.effectsPlane.setPosition(
        this.entity.getPosition().add(this._effectPlaneLocalPos)
      );
    for (let e = this._wearItemQueue.length - 1; e >= 0; e--) {
      let t = this._wearItemQueue[e];
      t.slot.enabled && (t.callback(), this._wearItemQueue.splice(e, 1), e--);
    }
  }),
  (Outfit.prototype.wearItem = function (e, t) {
    this.app.afterGroupLoaded(e, () => {
      if (this.entity.hasLeftGame) return;
      let s = this.entity.findByName(e);
      s &&
        (s && !1 === s.enabled
          ? this._wearItemQueue.push({
              slot: s,
              callback: () => {
                this._applyToSlot(s, t);
              },
            })
          : this._applyToSlot(s, t));
    });
  }),
  (Outfit.prototype._applyToSlot = function (e, t) {
    let s = this.app.itemDb.getItem(t.selected);
    if (null == e || null == s)
      return void console.log(
        this.entity.name + " slot or dbItem is null for: " + t.selected
      );
    if (
      (this._handleSpecialPreCases(e.name, s),
      (e.render.asset = s.mesh),
      s.hasStaticColor)
    )
      for (let t in e.render.meshInstances)
        e.render.meshInstances[t].material = s.materials[t].resource;
    else {
      let o = 0;
      const i = this.isLocalPlayer,
        l = this.playerMaterials;
      for (let a in e.render.meshInstances) {
        let r = s.materials[a],
          c = e.render.meshInstances[a];
        if (r && c)
          if ("skin_blender" == r.name) c.material = l.skinMaterial;
          else if ("skinShading_blender" == r.name)
            c.material = l.skinShadingMaterial;
          else if ("eyeColor_blender" == r.name) c.material = l.eyeMaterial;
          else if ("lipColor_blender" == r.name) c.material = l.lipMaterial;
          else if ("hairColor_blender" == r.name) c.material = l.hairMaterial;
          else if ("hairShading_blender" == r.name)
            c.material = l.hairShadingMaterial;
          else if ("blush" == r.name) c.material = l.blushMaterial;
          else if (this._forceBodyColorSlots.includes(e.name)) {
            const e = this.app.colorDb.getMaterial("default");
            c.material = e.resource;
          } else {
            o++;
            let e = this._getColorHex(t, o);
            if (void 0 === e) c.material = r.resource;
            else {
              i && (e = s["color" + o] || e);
              const t = this.app.colorDb.getMaterial(e);
              (c.material = t.resource),
                i &&
                  ((s["color" + o] = e),
                  (s.materials[a] = t),
                  (this.selection[s.itemCat]["color" + o] = e));
            }
          }
        else
          console.error(
            "material not found for " + t.selected + " material " + a
          );
      }
    }
    let o = s.itemCat;
    (this.selection[o].selected = t.selected),
      this._handleSpecialPostCases(e.name, s);
  }),
  (Outfit.prototype._getColorHex = function (e, t) {
    let s = e["color" + t];
    return "A089A4" == s && (s = "F1D8B9"), s;
  }),
  (Outfit.prototype._handleSpecialPreCases = function (e, t) {
    "hatSlot" == e
      ? ((this.selection.isWearingHat = "hatNone" != t.entity.name),
        this.app.fire(
          "setHairShapeKey",
          this.entity,
          this.selection.hair.selected
        ),
        this.wearItem("hairSlot", this.selection.hair))
      : "hairSlot" == e
      ? this.app.fire("setHairShapeKey", this.entity, t.entity.name)
      : "topSlot" == e
      ? this.app.fire("setTopShapeKey", this.entity, t.entity.name)
      : "bottomSlot" == e &&
        (this.app.fire(
          "setTopShapeKey",
          this.entity,
          this.selection.tops.selected
        ),
        this.wearItem("topSlot", this.selection.tops));
  }),
  (Outfit.prototype._handleSpecialPostCases = function (e, t) {
    "handheldSlot" == e
      ? (this.entity.script.charAnims.setHandheldPose(t.handheldPose),
        this.entity.script.playerEffects.applyEffect(t),
        "broom" == t.entity.name
          ? this.entity.script.charAnims.setBroom(!0)
          : this.entity.script.charAnims.setBroom(!1))
      : "hatSlot" == e
      ? "hatNone" != t.entity.name &&
        "hairTowel" == this.selection.hair.selected &&
        ((this.selection.hair.selected = "longStraight"),
        this.wearItem("hairSlot", this.selection.hair))
      : "headAccsSlot" == e
      ? t.isNoneItem ||
        "hairTowel" != this.selection.hair.selected ||
        ((this.selection.hair.selected = "longStraight"),
        this.wearItem("hairSlot", this.selection.hair))
      : "topSlot" == e
      ? (this.selection.isWearingDress &&
          this._firstSwapFromDress &&
          (this.playerMaterials.applyBodyColors(
            this.entity.findByName("bottomSlot")
          ),
          (this._firstSwapFromDress = !1)),
        this.setCustomArms(this.selection.tops.selected))
      : "bottomSlot" == e
      ? (this.selection.isWearingDress &&
          this._firstSwapFromDress &&
          (this.playerMaterials.applyBodyColors(
            this.entity.findByName("topSlot")
          ),
          (this._firstSwapFromDress = !1)),
        this.setCustomArms(this.selection.tops.selected))
      : "dressSlot" == e
      ? this.setCustomArms(this.selection.dresses.selected)
      : "shoeSlot" == e
      ? this.setHeelHeight(t)
      : "bagSlot" == e && this.entity.script.charAnims.setBagPose(t.bagPose);
  }),
  (Outfit.prototype.setHeelHeight = function (e) {
    if (this.entity.hasLeftGame) return;
    let t = this.entity.findByName("vortina3");
    switch (e.heelHeight) {
      case "heel1":
      default:
        t.setLocalPosition(0, 0, 0);
        break;
      case "heel2":
        t.setLocalPosition(0, 0.03, 0);
        break;
      case "heel3":
        t.setLocalPosition(0, 0.05, 0);
        break;
      case "heel4":
        t.setLocalPosition(0, 0.08, 0);
        break;
      case "heel5":
        t.setLocalPosition(0, 0.11, 0);
    }
  });
var RemotePlayer = pc.createScript("remotePlayer");
RemotePlayer.attributes.add("playerMesh", { type: "entity" }),
  RemotePlayer.attributes.add("stateBufferLength", {
    type: "number",
    default: 12,
    description:
      "The state buffer is purged if it's larger than this number. Useful when local player returns tab to focus",
  }),
  RemotePlayer.attributes.add("delayShrinkFactor", {
    type: "number",
    default: 3.5,
    description:
      "How quickly the player will catch up to their true position, lower values = smoother but less accurate, higher = jumpier but more accurate",
  }),
  RemotePlayer.attributes.add("emojiSlot", { type: "entity" }),
  RemotePlayer.attributes.add("playerNameElement", { type: "entity" }),
  RemotePlayer.attributes.add("vipIcon", { type: "entity" }),
  (RemotePlayer.prototype.initialize = function () {
    (this.entity.createdAt = pc.now()),
      (this.entity.isLocalPlayer = !1),
      (this.entity.isRemotePlayer = !0),
      (this.entity.positionOverrideActive = !1),
      (this.charAnims = this.entity.script.charAnims),
      (this.playerName = ""),
      (this.lastPos = this.entity.getPosition().clone()),
      (this.nextPos = this.lastPos.clone()),
      (this.tempQuat = new pc.Quat()),
      (this.lastRot = this.entity.getRotation().clone()),
      (this.nextRot = this.lastRot.clone()),
      (this.currentRot = this.lastRot.clone()),
      (this.currentPos = this.lastPos.clone()),
      (this.lastTimestamp = 0),
      (this.nextTimestamp = 0),
      (this.msBetweenUpdates = 0),
      (this.lerpCountdownMs = 0),
      (this.runningDelayMs = 0),
      (this.inputPercentage = 0),
      (this._numUpdatesApplied = 0),
      (this.entity.hasLeftGame = !1),
      (this._states = []),
      (this._emotePhase = 0),
      (this.emojiSprites = this.app.assets.findByTag("emojiSprite")),
      (this.flagSprites = this.app.assets.findByTag("flagSprite")),
      (this.sprites = this.emojiSprites.concat(this.flagSprites)),
      (this.emojiSlot.element.drawOrder = 100),
      (this.vipIcon.element.drawOrder = -100),
      (this.playerNameElement.element.drawOrder = -50),
      this.on(
        "disconnect",
        () => {
          this.entity.hasLeftGame = !0;
        },
        this
      ),
      this.on("destroy", () => {
        this.entity.hasLeftGame = !0;
      }),
      this.hide();
  }),
  (RemotePlayer.prototype.update = function (t) {
    if (this.msBetweenUpdates > 0) {
      const e = t / (1 / 60),
        s = this.runningDelayMs * (0.001 * this.delayShrinkFactor * e);
      (this.runningDelayMs -= s), (this.lerpCountdownMs -= 1e3 * t + s);
      const i = 1 - this.lerpCountdownMs / this.msBetweenUpdates;
      i <= 1
        ? (this.currentPos.lerp(this.lastPos, this.nextPos, i),
          this.currentRot.slerp(this.lastRot, this.nextRot, i),
          !1 === this.entity.positionOverrideActive &&
            (this.entity.setPosition(this.currentPos),
            this.entity.setRotation(this.currentRot)))
        : (!1 === this.entity.positionOverrideActive &&
            (this.entity.setPosition(this.currentPos),
            this.entity.setRotation(this.currentRot)),
          this._states.length > 0 &&
            (this._nextState(this._states.shift()),
            this._incrementNumUpdates()));
    } else
      this._states.length > 0 &&
        (0 == this._numUpdatesApplied
          ? (this._snapToState(this._states.shift()),
            this._incrementNumUpdates())
          : 0 === this.msBetweenUpdates &&
            (this._nextState(this._states.shift()),
            this._incrementNumUpdates()));
  }),
  (RemotePlayer.prototype._nextState = function (t) {
    if (this._states.length > this.stateBufferLength)
      return this._snapToState(this._states.pop()), void (this._states = []);
    if (
      ((this.lastTimestamp = this.nextTimestamp),
      (this.nextTimestamp = t[1]),
      (this.msBetweenUpdates = this.nextTimestamp - this.lastTimestamp),
      this.msBetweenUpdates >= 1e3)
    )
      return this._snapToState(t), void (this._states = []);
    if (
      ((this.lerpCountdownMs = this.msBetweenUpdates), this._states.length > 0)
    ) {
      const t = this._states[this._states.length - 1];
      this.runningDelayMs = t[1] - this.lastTimestamp;
    }
    this.lastRot.copy(this.entity.getRotation()),
      this.tempQuat.setFromEulerAngles(0, t[2], 0),
      this.nextRot.copy(this.tempQuat),
      this.lastPos.copy(this.entity.getPosition()),
      this.nextPos.set(t[3] / 100, t[4] / 100, t[5] / 100);
    const e = this.nextPos.x - this.lastPos.x,
      s = this.nextPos.z - this.lastPos.z;
    (e <= -25 || e >= 25 || s <= -25 || s >= 25) &&
      (this._snapToState(t), (this._states = []));
    if (t[7]) this.charAnims.setAnimJump(!0);
    else if (this.charAnims.isFollowingPlayer());
    else {
      this.charAnims.setAnimJump(!1);
      const e = t[6] / 100;
      e > 0
        ? (this.charAnims.setSpeedFromInputPercentage(e),
          this.charAnims.setAnimWalk(!0),
          1 === this._emotePhase && (this._emotePhase = 2))
        : (this.charAnims.setSpeed(1),
          this.charAnims.setAnimWalk(!1),
          2 === this._emotePhase &&
            ((this._emotePhase = 3), this.charAnims.setAnimIdle())),
        (this.inputPercentage = e),
        this.charAnims.setAnimInteger(t[8]);
    }
  }),
  (RemotePlayer.prototype._snapToState = function (t) {
    if (t && t.length >= 7) {
      (this.lastTimestamp = t[1]),
        (this.nextTimestamp = this.lastTimestamp),
        (this.msBetweenUpdates = 0),
        (this.lerpCountdownMs = 0);
      let e = this.entity.getRotation();
      e.setFromEulerAngles(0, t[2], 0);
      let s = this.entity.getPosition();
      s.set(t[3] / 100, t[4] / 100, t[5] / 100),
        !1 === this.entity.positionOverrideActive &&
          (this.entity.setPosition(s), this.entity.setRotation(e)),
        !1 === this.charAnims.isFollowingPlayer() &&
          this.charAnims.setAnimInteger(t[8]),
        this.lastPos.copy(s),
        this.lastRot.copy(e);
    } else
      this.lastPos.copy(this.entity.getPosition()),
        this.lastRot.copy(this.entity.getRotation()),
        (this.nextTimestamp = this.lastTimestamp),
        (this.msBetweenUpdates = 0),
        (this.lerpCountdownMs = 0);
  }),
  (RemotePlayer.prototype.applyStateUpdate = function (t) {
    const e = t[2];
    for (let t in e) {
      const s = [];
      for (let i in e[t]) s.push(e[t][i][1]);
      const i = this._validateState(s);
      this._states.push(i);
    }
  }),
  (RemotePlayer.prototype._validateState = function (t) {
    return [
      this.app.networkCodes.PLAYER_STATE,
      "number" == typeof t[0] && t[0] >= 0 ? t[0] : this.nextTimestamp,
      "number" == typeof t[1] && isFinite(t[1]) ? t[1] : 0,
      "number" == typeof t[2] && isFinite(t[2]) ? t[2] : 0,
      "number" == typeof t[3] && isFinite(t[3]) ? t[3] : 0,
      "number" == typeof t[4] && isFinite(t[4]) ? t[4] : 0,
      "number" == typeof t[5] && isFinite(t[5]) ? t[5] : 0,
      "boolean" == typeof t[6] && t[6],
      "number" == typeof t[7] && isFinite(t[7]) ? t[7] : 0,
    ];
  }),
  (RemotePlayer.prototype._incrementNumUpdates = function () {
    0 === this._numUpdatesApplied
      ? ((this._numUpdatesApplied += 1), this.show())
      : (this._numUpdatesApplied += 1);
  }),
  (RemotePlayer.prototype.applyCommunicationUpdate = function (t) {
    const e = t[2];
    if (!e || e.length <= 0) return;
    const s = e[0][1];
    if (0 === s)
      this.app.afterGroupLoaded(
        "emojis",
        () => {
          const t = e[1][1],
            s = this.sprites;
          let i = "";
          t < 10 ? (i = "00") : t < 100 && (i = "0");
          for (let e in s)
            if (s[e].name == "Frame " + i + t) {
              let t = this.emojiSlot;
              return (
                (t.element.spriteAsset = s[e]),
                t.script.pulse.start(),
                t.script.fade.fadeIn(),
                void t.script.fade.fadeOut()
              );
            }
        },
        this
      );
    else if (1 === s)
      (this.playerNameElement.element.text = e[1][1]),
        (this.playerName = e[1][1]);
    else if (2 === s);
    else if (5 === s) {
      const t = e[1][1];
      this.vipIcon.enabled = "vip" === t;
    } else if (6 === s && this.charAnims) {
      const t = e[1][1];
      let s = null;
      (s =
        this.app.server.clientId === t
          ? this.app.globals.localPlayer
          : this.app.remotePlayers[t]),
        s && s.script && s.script.charAnims
          ? this.charAnims.setFollowPlayer(s)
          : this.charAnims.clearFollowPlayer();
    }
  }),
  (RemotePlayer.prototype.setName = function (t) {
    (this.playerNameElement.element.text = t), (this.playerName = t);
  }),
  (RemotePlayer.prototype.hide = function () {
    (this.playerMesh.enabled = !1), (this.playerNameElement.enabled = !1);
  }),
  (RemotePlayer.prototype.show = function () {
    this._numUpdatesApplied > 0 &&
      ((this.playerMesh.enabled = !0), (this.playerNameElement.enabled = !0));
  }),
  (RemotePlayer.prototype.isHidden = function () {
    return !this.playerMesh.enabled && !this.playerNameElement.enabled;
  }); // msgpack.min.js
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.MessagePack = t())
    : (e.MessagePack = t());
})(this, function () {
  return (function () {
    "use strict";
    var e = {
        d: function (t, r) {
          for (var n in r)
            e.o(r, n) &&
              !e.o(t, n) &&
              Object.defineProperty(t, n, { enumerable: !0, get: r[n] });
        },
        o: function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        },
        r: function (e) {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        },
      },
      t = {};
    e.r(t),
      e.d(t, {
        DataViewIndexOutOfBoundsError: function () {
          return W;
        },
        DecodeError: function () {
          return g;
        },
        Decoder: function () {
          return R;
        },
        EXT_TIMESTAMP: function () {
          return b;
        },
        Encoder: function () {
          return I;
        },
        ExtData: function () {
          return w;
        },
        ExtensionCodec: function () {
          return L;
        },
        decode: function () {
          return N;
        },
        decodeArrayStream: function () {
          return $;
        },
        decodeAsync: function () {
          return Z;
        },
        decodeMulti: function () {
          return G;
        },
        decodeMultiStream: function () {
          return ee;
        },
        decodeStream: function () {
          return te;
        },
        decodeTimestampExtension: function () {
          return E;
        },
        decodeTimestampToTimeSpec: function () {
          return S;
        },
        encode: function () {
          return M;
        },
        encodeDateToTimeSpec: function () {
          return m;
        },
        encodeTimeSpecToTimestamp: function () {
          return x;
        },
        encodeTimestampExtension: function () {
          return U;
        },
      });
    var r = 4294967295;
    function n(e, t, r) {
      var n = Math.floor(r / 4294967296),
        i = r;
      e.setUint32(t, n), e.setUint32(t + 4, i);
    }
    function i(e, t) {
      return 4294967296 * e.getInt32(t) + e.getUint32(t + 4);
    }
    var o = function (e, t) {
        var r = "function" == typeof Symbol && e[Symbol.iterator];
        if (!r) return e;
        var n,
          i,
          o = r.call(e),
          s = [];
        try {
          for (; (void 0 === t || t-- > 0) && !(n = o.next()).done; )
            s.push(n.value);
        } catch (e) {
          i = { error: e };
        } finally {
          try {
            n && !n.done && (r = o.return) && r.call(o);
          } finally {
            if (i) throw i.error;
          }
        }
        return s;
      },
      s = function (e, t, r) {
        if (r || 2 === arguments.length)
          for (var n, i = 0, o = t.length; i < o; i++)
            (!n && i in t) ||
              (n || (n = Array.prototype.slice.call(t, 0, i)), (n[i] = t[i]));
        return e.concat(n || Array.prototype.slice.call(t));
      },
      a =
        "undefined" != typeof TextEncoder && "undefined" != typeof TextDecoder;
    function h(e) {
      for (var t = e.length, r = 0, n = 0; n < t; ) {
        var i = e.charCodeAt(n++);
        if (0 != (4294967168 & i))
          if (0 == (4294965248 & i)) r += 2;
          else {
            if (i >= 55296 && i <= 56319 && n < t) {
              var o = e.charCodeAt(n);
              56320 == (64512 & o) &&
                (++n, (i = ((1023 & i) << 10) + (1023 & o) + 65536));
            }
            r += 0 == (4294901760 & i) ? 3 : 4;
          }
        else r++;
      }
      return r;
    }
    var c = a ? new TextEncoder() : void 0,
      u = a ? ("undefined" != typeof process ? 200 : 0) : r,
      f = (null == c ? void 0 : c.encodeInto)
        ? function (e, t, r) {
            c.encodeInto(e, t.subarray(r));
          }
        : function (e, t, r) {
            t.set(c.encode(e), r);
          };
    function l(e, t, r) {
      for (var n = t, i = n + r, a = [], h = ""; n < i; ) {
        var c = e[n++];
        if (0 == (128 & c)) a.push(c);
        else if (192 == (224 & c)) {
          var u = 63 & e[n++];
          a.push(((31 & c) << 6) | u);
        } else if (224 == (240 & c)) {
          u = 63 & e[n++];
          var f = 63 & e[n++];
          a.push(((31 & c) << 12) | (u << 6) | f);
        } else if (240 == (248 & c)) {
          var l =
            ((7 & c) << 18) |
            ((u = 63 & e[n++]) << 12) |
            ((f = 63 & e[n++]) << 6) |
            (63 & e[n++]);
          l > 65535 &&
            ((l -= 65536),
            a.push(((l >>> 10) & 1023) | 55296),
            (l = 56320 | (1023 & l))),
            a.push(l);
        } else a.push(c);
        a.length >= 4096 &&
          ((h += String.fromCharCode.apply(String, s([], o(a), !1))),
          (a.length = 0));
      }
      return (
        a.length > 0 &&
          (h += String.fromCharCode.apply(String, s([], o(a), !1))),
        h
      );
    }
    var p,
      d = a ? new TextDecoder() : null,
      y = a ? ("undefined" != typeof process ? 200 : 0) : r,
      w = function (e, t) {
        (this.type = e), (this.data = t);
      },
      v =
        ((p = function (e, t) {
          return (p =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var r in t)
                Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            })(e, t);
        }),
        function (e, t) {
          if ("function" != typeof t && null !== t)
            throw new TypeError(
              "Class extends value " +
                String(t) +
                " is not a constructor or null"
            );
          function r() {
            this.constructor = e;
          }
          p(e, t),
            (e.prototype =
              null === t
                ? Object.create(t)
                : ((r.prototype = t.prototype), new r()));
        }),
      g = (function (e) {
        function t(r) {
          var n = e.call(this, r) || this,
            i = Object.create(t.prototype);
          return (
            Object.setPrototypeOf(n, i),
            Object.defineProperty(n, "name", {
              configurable: !0,
              enumerable: !1,
              value: t.name,
            }),
            n
          );
        }
        return v(t, e), t;
      })(Error),
      b = -1;
    function x(e) {
      var t,
        r = e.sec,
        i = e.nsec;
      if (r >= 0 && i >= 0 && r <= 17179869183) {
        if (0 === i && r <= 4294967295) {
          var o = new Uint8Array(4);
          return (t = new DataView(o.buffer)).setUint32(0, r), o;
        }
        var s = r / 4294967296,
          a = 4294967295 & r;
        return (
          (o = new Uint8Array(8)),
          (t = new DataView(o.buffer)).setUint32(0, (i << 2) | (3 & s)),
          t.setUint32(4, a),
          o
        );
      }
      return (
        (o = new Uint8Array(12)),
        (t = new DataView(o.buffer)).setUint32(0, i),
        n(t, 4, r),
        o
      );
    }
    function m(e) {
      var t = e.getTime(),
        r = Math.floor(t / 1e3),
        n = 1e6 * (t - 1e3 * r),
        i = Math.floor(n / 1e9);
      return { sec: r + i, nsec: n - 1e9 * i };
    }
    function U(e) {
      return e instanceof Date ? x(m(e)) : null;
    }
    function S(e) {
      var t = new DataView(e.buffer, e.byteOffset, e.byteLength);
      switch (e.byteLength) {
        case 4:
          return { sec: t.getUint32(0), nsec: 0 };
        case 8:
          var r = t.getUint32(0);
          return { sec: 4294967296 * (3 & r) + t.getUint32(4), nsec: r >>> 2 };
        case 12:
          return { sec: i(t, 4), nsec: t.getUint32(0) };
        default:
          throw new g(
            "Unrecognized data size for timestamp (expected 4, 8, or 12): " +
              e.length
          );
      }
    }
    function E(e) {
      var t = S(e);
      return new Date(1e3 * t.sec + t.nsec / 1e6);
    }
    var B = { type: b, encode: U, decode: E },
      L = (function () {
        function e() {
          (this.builtInEncoders = []),
            (this.builtInDecoders = []),
            (this.encoders = []),
            (this.decoders = []),
            this.register(B);
        }
        return (
          (e.prototype.register = function (e) {
            var t = e.type,
              r = e.encode,
              n = e.decode;
            if (t >= 0) (this.encoders[t] = r), (this.decoders[t] = n);
            else {
              var i = 1 + t;
              (this.builtInEncoders[i] = r), (this.builtInDecoders[i] = n);
            }
          }),
          (e.prototype.tryToEncode = function (e, t) {
            for (var r = 0; r < this.builtInEncoders.length; r++)
              if (
                null != (n = this.builtInEncoders[r]) &&
                null != (i = n(e, t))
              )
                return new w(-1 - r, i);
            for (r = 0; r < this.encoders.length; r++) {
              var n, i;
              if (null != (n = this.encoders[r]) && null != (i = n(e, t)))
                return new w(r, i);
            }
            return e instanceof w ? e : null;
          }),
          (e.prototype.decode = function (e, t, r) {
            var n = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
            return n ? n(e, t, r) : new w(t, e);
          }),
          (e.defaultCodec = new e()),
          e
        );
      })();
    function A(e) {
      return e instanceof Uint8Array
        ? e
        : ArrayBuffer.isView(e)
        ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
        : e instanceof ArrayBuffer
        ? new Uint8Array(e)
        : Uint8Array.from(e);
    }
    var T = function (e) {
        var t = "function" == typeof Symbol && Symbol.iterator,
          r = t && e[t],
          n = 0;
        if (r) return r.call(e);
        if (e && "number" == typeof e.length)
          return {
            next: function () {
              return (
                e && n >= e.length && (e = void 0),
                { value: e && e[n++], done: !e }
              );
            },
          };
        throw new TypeError(
          t ? "Object is not iterable." : "Symbol.iterator is not defined."
        );
      },
      I = (function () {
        function e(e, t, r, n, i, o, s, a) {
          void 0 === e && (e = L.defaultCodec),
            void 0 === t && (t = void 0),
            void 0 === r && (r = 100),
            void 0 === n && (n = 2048),
            void 0 === i && (i = !1),
            void 0 === o && (o = !1),
            void 0 === s && (s = !1),
            void 0 === a && (a = !1),
            (this.extensionCodec = e),
            (this.context = t),
            (this.maxDepth = r),
            (this.initialBufferSize = n),
            (this.sortKeys = i),
            (this.forceFloat32 = o),
            (this.ignoreUndefined = s),
            (this.forceIntegerToFloat = a),
            (this.pos = 0),
            (this.view = new DataView(new ArrayBuffer(this.initialBufferSize))),
            (this.bytes = new Uint8Array(this.view.buffer));
        }
        return (
          (e.prototype.getUint8Array = function () {
            return this.bytes.subarray(0, this.pos);
          }),
          (e.prototype.reinitializeState = function () {
            this.pos = 0;
          }),
          (e.prototype.encode = function (e) {
            return (
              this.reinitializeState(),
              this.doEncode(e, 1),
              this.getUint8Array()
            );
          }),
          (e.prototype.doEncode = function (e, t) {
            if (t > this.maxDepth)
              throw new Error("Too deep objects in depth " + t);
            null == e
              ? this.encodeNil()
              : "boolean" == typeof e
              ? this.encodeBoolean(e)
              : "number" == typeof e
              ? this.encodeNumber(e)
              : "string" == typeof e
              ? this.encodeString(e)
              : this.encodeObject(e, t);
          }),
          (e.prototype.ensureBufferSizeToWrite = function (e) {
            var t = this.pos + e;
            this.view.byteLength < t && this.resizeBuffer(2 * t);
          }),
          (e.prototype.resizeBuffer = function (e) {
            var t = new ArrayBuffer(e),
              r = new Uint8Array(t),
              n = new DataView(t);
            r.set(this.bytes), (this.view = n), (this.bytes = r);
          }),
          (e.prototype.encodeNil = function () {
            this.writeU8(192);
          }),
          (e.prototype.encodeBoolean = function (e) {
            !1 === e ? this.writeU8(194) : this.writeU8(195);
          }),
          (e.prototype.encodeNumber = function (e) {
            Number.isSafeInteger(e) && !this.forceIntegerToFloat
              ? e >= 0
                ? e < 128
                  ? this.writeU8(e)
                  : e < 256
                  ? (this.writeU8(204), this.writeU8(e))
                  : e < 65536
                  ? (this.writeU8(205), this.writeU16(e))
                  : e < 4294967296
                  ? (this.writeU8(206), this.writeU32(e))
                  : (this.writeU8(207), this.writeU64(e))
                : e >= -32
                ? this.writeU8(224 | (e + 32))
                : e >= -128
                ? (this.writeU8(208), this.writeI8(e))
                : e >= -32768
                ? (this.writeU8(209), this.writeI16(e))
                : e >= -2147483648
                ? (this.writeU8(210), this.writeI32(e))
                : (this.writeU8(211), this.writeI64(e))
              : this.forceFloat32
              ? (this.writeU8(202), this.writeF32(e))
              : (this.writeU8(203), this.writeF64(e));
          }),
          (e.prototype.writeStringHeader = function (e) {
            if (e < 32) this.writeU8(160 + e);
            else if (e < 256) this.writeU8(217), this.writeU8(e);
            else if (e < 65536) this.writeU8(218), this.writeU16(e);
            else {
              if (!(e < 4294967296))
                throw new Error("Too long string: " + e + " bytes in UTF-8");
              this.writeU8(219), this.writeU32(e);
            }
          }),
          (e.prototype.encodeString = function (e) {
            if (e.length > u) {
              var t = h(e);
              this.ensureBufferSizeToWrite(5 + t),
                this.writeStringHeader(t),
                f(e, this.bytes, this.pos),
                (this.pos += t);
            } else
              (t = h(e)),
                this.ensureBufferSizeToWrite(5 + t),
                this.writeStringHeader(t),
                (function (e, t, r) {
                  for (var n = e.length, i = r, o = 0; o < n; ) {
                    var s = e.charCodeAt(o++);
                    if (0 != (4294967168 & s)) {
                      if (0 == (4294965248 & s)) t[i++] = ((s >> 6) & 31) | 192;
                      else {
                        if (s >= 55296 && s <= 56319 && o < n) {
                          var a = e.charCodeAt(o);
                          56320 == (64512 & a) &&
                            (++o,
                            (s = ((1023 & s) << 10) + (1023 & a) + 65536));
                        }
                        0 == (4294901760 & s)
                          ? ((t[i++] = ((s >> 12) & 15) | 224),
                            (t[i++] = ((s >> 6) & 63) | 128))
                          : ((t[i++] = ((s >> 18) & 7) | 240),
                            (t[i++] = ((s >> 12) & 63) | 128),
                            (t[i++] = ((s >> 6) & 63) | 128));
                      }
                      t[i++] = (63 & s) | 128;
                    } else t[i++] = s;
                  }
                })(e, this.bytes, this.pos),
                (this.pos += t);
          }),
          (e.prototype.encodeObject = function (e, t) {
            var r = this.extensionCodec.tryToEncode(e, this.context);
            if (null != r) this.encodeExtension(r);
            else if (Array.isArray(e)) this.encodeArray(e, t);
            else if (ArrayBuffer.isView(e)) this.encodeBinary(e);
            else {
              if ("object" != typeof e)
                throw new Error(
                  "Unrecognized object: " + Object.prototype.toString.apply(e)
                );
              this.encodeMap(e, t);
            }
          }),
          (e.prototype.encodeBinary = function (e) {
            var t = e.byteLength;
            if (t < 256) this.writeU8(196), this.writeU8(t);
            else if (t < 65536) this.writeU8(197), this.writeU16(t);
            else {
              if (!(t < 4294967296)) throw new Error("Too large binary: " + t);
              this.writeU8(198), this.writeU32(t);
            }
            var r = A(e);
            this.writeU8a(r);
          }),
          (e.prototype.encodeArray = function (e, t) {
            var r,
              n,
              i = e.length;
            if (i < 16) this.writeU8(144 + i);
            else if (i < 65536) this.writeU8(220), this.writeU16(i);
            else {
              if (!(i < 4294967296)) throw new Error("Too large array: " + i);
              this.writeU8(221), this.writeU32(i);
            }
            try {
              for (var o = T(e), s = o.next(); !s.done; s = o.next()) {
                var a = s.value;
                this.doEncode(a, t + 1);
              }
            } catch (e) {
              r = { error: e };
            } finally {
              try {
                s && !s.done && (n = o.return) && n.call(o);
              } finally {
                if (r) throw r.error;
              }
            }
          }),
          (e.prototype.countWithoutUndefined = function (e, t) {
            var r,
              n,
              i = 0;
            try {
              for (var o = T(t), s = o.next(); !s.done; s = o.next())
                void 0 !== e[s.value] && i++;
            } catch (e) {
              r = { error: e };
            } finally {
              try {
                s && !s.done && (n = o.return) && n.call(o);
              } finally {
                if (r) throw r.error;
              }
            }
            return i;
          }),
          (e.prototype.encodeMap = function (e, t) {
            var r,
              n,
              i = Object.keys(e);
            this.sortKeys && i.sort();
            var o = this.ignoreUndefined
              ? this.countWithoutUndefined(e, i)
              : i.length;
            if (o < 16) this.writeU8(128 + o);
            else if (o < 65536) this.writeU8(222), this.writeU16(o);
            else {
              if (!(o < 4294967296))
                throw new Error("Too large map object: " + o);
              this.writeU8(223), this.writeU32(o);
            }
            try {
              for (var s = T(i), a = s.next(); !a.done; a = s.next()) {
                var h = a.value,
                  c = e[h];
                (this.ignoreUndefined && void 0 === c) ||
                  (this.encodeString(h), this.doEncode(c, t + 1));
              }
            } catch (e) {
              r = { error: e };
            } finally {
              try {
                a && !a.done && (n = s.return) && n.call(s);
              } finally {
                if (r) throw r.error;
              }
            }
          }),
          (e.prototype.encodeExtension = function (e) {
            var t = e.data.length;
            if (1 === t) this.writeU8(212);
            else if (2 === t) this.writeU8(213);
            else if (4 === t) this.writeU8(214);
            else if (8 === t) this.writeU8(215);
            else if (16 === t) this.writeU8(216);
            else if (t < 256) this.writeU8(199), this.writeU8(t);
            else if (t < 65536) this.writeU8(200), this.writeU16(t);
            else {
              if (!(t < 4294967296))
                throw new Error("Too large extension object: " + t);
              this.writeU8(201), this.writeU32(t);
            }
            this.writeI8(e.type), this.writeU8a(e.data);
          }),
          (e.prototype.writeU8 = function (e) {
            this.ensureBufferSizeToWrite(1),
              this.view.setUint8(this.pos, e),
              this.pos++;
          }),
          (e.prototype.writeU8a = function (e) {
            var t = e.length;
            this.ensureBufferSizeToWrite(t),
              this.bytes.set(e, this.pos),
              (this.pos += t);
          }),
          (e.prototype.writeI8 = function (e) {
            this.ensureBufferSizeToWrite(1),
              this.view.setInt8(this.pos, e),
              this.pos++;
          }),
          (e.prototype.writeU16 = function (e) {
            this.ensureBufferSizeToWrite(2),
              this.view.setUint16(this.pos, e),
              (this.pos += 2);
          }),
          (e.prototype.writeI16 = function (e) {
            this.ensureBufferSizeToWrite(2),
              this.view.setInt16(this.pos, e),
              (this.pos += 2);
          }),
          (e.prototype.writeU32 = function (e) {
            this.ensureBufferSizeToWrite(4),
              this.view.setUint32(this.pos, e),
              (this.pos += 4);
          }),
          (e.prototype.writeI32 = function (e) {
            this.ensureBufferSizeToWrite(4),
              this.view.setInt32(this.pos, e),
              (this.pos += 4);
          }),
          (e.prototype.writeF32 = function (e) {
            this.ensureBufferSizeToWrite(4),
              this.view.setFloat32(this.pos, e),
              (this.pos += 4);
          }),
          (e.prototype.writeF64 = function (e) {
            this.ensureBufferSizeToWrite(8),
              this.view.setFloat64(this.pos, e),
              (this.pos += 8);
          }),
          (e.prototype.writeU64 = function (e) {
            this.ensureBufferSizeToWrite(8),
              (function (e, t, r) {
                var n = r / 4294967296,
                  i = r;
                e.setUint32(t, n), e.setUint32(t + 4, i);
              })(this.view, this.pos, e),
              (this.pos += 8);
          }),
          (e.prototype.writeI64 = function (e) {
            this.ensureBufferSizeToWrite(8),
              n(this.view, this.pos, e),
              (this.pos += 8);
          }),
          e
        );
      })(),
      k = {};
    function M(e, t) {
      return (
        void 0 === t && (t = k),
        new I(
          t.extensionCodec,
          t.context,
          t.maxDepth,
          t.initialBufferSize,
          t.sortKeys,
          t.forceFloat32,
          t.ignoreUndefined,
          t.forceIntegerToFloat
        ).encode(e)
      );
    }
    function z(e) {
      return (
        (e < 0 ? "-" : "") + "0x" + Math.abs(e).toString(16).padStart(2, "0")
      );
    }
    var D = (function () {
        function e(e, t) {
          void 0 === e && (e = 16),
            void 0 === t && (t = 16),
            (this.maxKeyLength = e),
            (this.maxLengthPerKey = t),
            (this.hit = 0),
            (this.miss = 0),
            (this.caches = []);
          for (var r = 0; r < this.maxKeyLength; r++) this.caches.push([]);
        }
        return (
          (e.prototype.canBeCached = function (e) {
            return e > 0 && e <= this.maxKeyLength;
          }),
          (e.prototype.find = function (e, t, r) {
            var n,
              i,
              o = this.caches[r - 1];
            try {
              e: for (
                var s = (function (e) {
                    var t = "function" == typeof Symbol && Symbol.iterator,
                      r = t && e[t],
                      n = 0;
                    if (r) return r.call(e);
                    if (e && "number" == typeof e.length)
                      return {
                        next: function () {
                          return (
                            e && n >= e.length && (e = void 0),
                            { value: e && e[n++], done: !e }
                          );
                        },
                      };
                    throw new TypeError(
                      t
                        ? "Object is not iterable."
                        : "Symbol.iterator is not defined."
                    );
                  })(o),
                  a = s.next();
                !a.done;
                a = s.next()
              ) {
                for (var h = a.value, c = h.bytes, u = 0; u < r; u++)
                  if (c[u] !== e[t + u]) continue e;
                return h.str;
              }
            } catch (e) {
              n = { error: e };
            } finally {
              try {
                a && !a.done && (i = s.return) && i.call(s);
              } finally {
                if (n) throw n.error;
              }
            }
            return null;
          }),
          (e.prototype.store = function (e, t) {
            var r = this.caches[e.length - 1],
              n = { bytes: e, str: t };
            r.length >= this.maxLengthPerKey
              ? (r[(Math.random() * r.length) | 0] = n)
              : r.push(n);
          }),
          (e.prototype.decode = function (e, t, r) {
            var n = this.find(e, t, r);
            if (null != n) return this.hit++, n;
            this.miss++;
            var i = l(e, t, r),
              o = Uint8Array.prototype.slice.call(e, t, t + r);
            return this.store(o, i), i;
          }),
          e
        );
      })(),
      P = function (e, t) {
        var r,
          n,
          i,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & i[0]) throw i[1];
              return i[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (o = { next: a(0), throw: a(1), return: a(2) }),
          "function" == typeof Symbol &&
            (o[Symbol.iterator] = function () {
              return this;
            }),
          o
        );
        function a(o) {
          return function (a) {
            return (function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s; )
                try {
                  if (
                    ((r = 1),
                    n &&
                      (i =
                        2 & o[0]
                          ? n.return
                          : o[0]
                          ? n.throw || ((i = n.return) && i.call(n), 0)
                          : n.next) &&
                      !(i = i.call(n, o[1])).done)
                  )
                    return i;
                  switch (((n = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, { value: o[1], done: !1 };
                    case 5:
                      s.label++, (n = o[1]), (o = [0]);
                      continue;
                    case 7:
                      (o = s.ops.pop()), s.trys.pop();
                      continue;
                    default:
                      if (
                        !(
                          (i = (i = s.trys).length > 0 && i[i.length - 1]) ||
                          (6 !== o[0] && 2 !== o[0])
                        )
                      ) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        (s.label = i[1]), (i = o);
                        break;
                      }
                      if (i && s.label < i[2]) {
                        (s.label = i[2]), s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  (o = [6, e]), (n = 0);
                } finally {
                  r = i = 0;
                }
              if (5 & o[0]) throw o[1];
              return { value: o[0] ? o[1] : void 0, done: !0 };
            })([o, a]);
          };
        }
      },
      C = function (e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          r = e[Symbol.asyncIterator];
        return r
          ? r.call(e)
          : ((e =
              "function" == typeof __values
                ? __values(e)
                : e[Symbol.iterator]()),
            (t = {}),
            n("next"),
            n("throw"),
            n("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function n(r) {
          t[r] =
            e[r] &&
            function (t) {
              return new Promise(function (n, i) {
                !(function (e, t, r, n) {
                  Promise.resolve(n).then(function (t) {
                    e({ value: t, done: r });
                  }, t);
                })(n, i, (t = e[r](t)).done, t.value);
              });
            };
        }
      },
      O = function (e) {
        return this instanceof O ? ((this.v = e), this) : new O(e);
      },
      j = function (e, t, r) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          i = r.apply(e, t || []),
          o = [];
        return (
          (n = {}),
          s("next"),
          s("throw"),
          s("return"),
          (n[Symbol.asyncIterator] = function () {
            return this;
          }),
          n
        );
        function s(e) {
          i[e] &&
            (n[e] = function (t) {
              return new Promise(function (r, n) {
                o.push([e, t, r, n]) > 1 || a(e, t);
              });
            });
        }
        function a(e, t) {
          try {
            (r = i[e](t)).value instanceof O
              ? Promise.resolve(r.value.v).then(h, c)
              : u(o[0][2], r);
          } catch (e) {
            u(o[0][3], e);
          }
          var r;
        }
        function h(e) {
          a("next", e);
        }
        function c(e) {
          a("throw", e);
        }
        function u(e, t) {
          e(t), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      },
      _ = new DataView(new ArrayBuffer(0)),
      F = new Uint8Array(_.buffer),
      W = (function () {
        try {
          _.getInt8(0);
        } catch (e) {
          return e.constructor;
        }
        throw new Error("never reached");
      })(),
      V = new W("Insufficient data"),
      K = new D(),
      R = (function () {
        function e(e, t, n, i, o, s, a, h) {
          void 0 === e && (e = L.defaultCodec),
            void 0 === t && (t = void 0),
            void 0 === n && (n = r),
            void 0 === i && (i = r),
            void 0 === o && (o = r),
            void 0 === s && (s = r),
            void 0 === a && (a = r),
            void 0 === h && (h = K),
            (this.extensionCodec = e),
            (this.context = t),
            (this.maxStrLength = n),
            (this.maxBinLength = i),
            (this.maxArrayLength = o),
            (this.maxMapLength = s),
            (this.maxExtLength = a),
            (this.keyDecoder = h),
            (this.totalPos = 0),
            (this.pos = 0),
            (this.view = _),
            (this.bytes = F),
            (this.headByte = -1),
            (this.stack = []);
        }
        return (
          (e.prototype.reinitializeState = function () {
            (this.totalPos = 0), (this.headByte = -1), (this.stack.length = 0);
          }),
          (e.prototype.setBuffer = function (e) {
            (this.bytes = A(e)),
              (this.view = (function (e) {
                if (e instanceof ArrayBuffer) return new DataView(e);
                var t = A(e);
                return new DataView(t.buffer, t.byteOffset, t.byteLength);
              })(this.bytes)),
              (this.pos = 0);
          }),
          (e.prototype.appendBuffer = function (e) {
            if (-1 !== this.headByte || this.hasRemaining(1)) {
              var t = this.bytes.subarray(this.pos),
                r = A(e),
                n = new Uint8Array(t.length + r.length);
              n.set(t), n.set(r, t.length), this.setBuffer(n);
            } else this.setBuffer(e);
          }),
          (e.prototype.hasRemaining = function (e) {
            return this.view.byteLength - this.pos >= e;
          }),
          (e.prototype.createExtraByteError = function (e) {
            var t = this.view,
              r = this.pos;
            return new RangeError(
              "Extra " +
                (t.byteLength - r) +
                " of " +
                t.byteLength +
                " byte(s) found at buffer[" +
                e +
                "]"
            );
          }),
          (e.prototype.decode = function (e) {
            this.reinitializeState(), this.setBuffer(e);
            var t = this.doDecodeSync();
            if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
            return t;
          }),
          (e.prototype.decodeMulti = function (e) {
            return P(this, function (t) {
              switch (t.label) {
                case 0:
                  this.reinitializeState(), this.setBuffer(e), (t.label = 1);
                case 1:
                  return this.hasRemaining(1)
                    ? [4, this.doDecodeSync()]
                    : [3, 3];
                case 2:
                  return t.sent(), [3, 1];
                case 3:
                  return [2];
              }
            });
          }),
          (e.prototype.decodeAsync = function (e) {
            var t, r, n, i, o, s, a, h;
            return (
              (o = this),
              (s = void 0),
              (h = function () {
                var o, s, a, h, c, u, f, l;
                return P(this, function (p) {
                  switch (p.label) {
                    case 0:
                      (o = !1), (p.label = 1);
                    case 1:
                      p.trys.push([1, 6, 7, 12]), (t = C(e)), (p.label = 2);
                    case 2:
                      return [4, t.next()];
                    case 3:
                      if ((r = p.sent()).done) return [3, 5];
                      if (((a = r.value), o))
                        throw this.createExtraByteError(this.totalPos);
                      this.appendBuffer(a);
                      try {
                        (s = this.doDecodeSync()), (o = !0);
                      } catch (e) {
                        if (!(e instanceof W)) throw e;
                      }
                      (this.totalPos += this.pos), (p.label = 4);
                    case 4:
                      return [3, 2];
                    case 5:
                      return [3, 12];
                    case 6:
                      return (h = p.sent()), (n = { error: h }), [3, 12];
                    case 7:
                      return (
                        p.trys.push([7, , 10, 11]),
                        r && !r.done && (i = t.return) ? [4, i.call(t)] : [3, 9]
                      );
                    case 8:
                      p.sent(), (p.label = 9);
                    case 9:
                      return [3, 11];
                    case 10:
                      if (n) throw n.error;
                      return [7];
                    case 11:
                      return [7];
                    case 12:
                      if (o) {
                        if (this.hasRemaining(1))
                          throw this.createExtraByteError(this.totalPos);
                        return [2, s];
                      }
                      throw (
                        ((u = (c = this).headByte),
                        (f = c.pos),
                        (l = c.totalPos),
                        new RangeError(
                          "Insufficient data in parsing " +
                            z(u) +
                            " at " +
                            l +
                            " (" +
                            f +
                            " in the current buffer)"
                        ))
                      );
                  }
                });
              }),
              new ((a = void 0) || (a = Promise))(function (e, t) {
                function r(e) {
                  try {
                    i(h.next(e));
                  } catch (e) {
                    t(e);
                  }
                }
                function n(e) {
                  try {
                    i(h.throw(e));
                  } catch (e) {
                    t(e);
                  }
                }
                function i(t) {
                  var i;
                  t.done
                    ? e(t.value)
                    : ((i = t.value),
                      i instanceof a
                        ? i
                        : new a(function (e) {
                            e(i);
                          })).then(r, n);
                }
                i((h = h.apply(o, s || [])).next());
              })
            );
          }),
          (e.prototype.decodeArrayStream = function (e) {
            return this.decodeMultiAsync(e, !0);
          }),
          (e.prototype.decodeStream = function (e) {
            return this.decodeMultiAsync(e, !1);
          }),
          (e.prototype.decodeMultiAsync = function (e, t) {
            return j(this, arguments, function () {
              var r, n, i, o, s, a, h, c, u;
              return P(this, function (f) {
                switch (f.label) {
                  case 0:
                    (r = t), (n = -1), (f.label = 1);
                  case 1:
                    f.trys.push([1, 13, 14, 19]), (i = C(e)), (f.label = 2);
                  case 2:
                    return [4, O(i.next())];
                  case 3:
                    if ((o = f.sent()).done) return [3, 12];
                    if (((s = o.value), t && 0 === n))
                      throw this.createExtraByteError(this.totalPos);
                    this.appendBuffer(s),
                      r &&
                        ((n = this.readArraySize()), (r = !1), this.complete()),
                      (f.label = 4);
                  case 4:
                    f.trys.push([4, 9, , 10]), (f.label = 5);
                  case 5:
                    return [4, O(this.doDecodeSync())];
                  case 6:
                    return [4, f.sent()];
                  case 7:
                    return f.sent(), 0 == --n ? [3, 8] : [3, 5];
                  case 8:
                    return [3, 10];
                  case 9:
                    if (!((a = f.sent()) instanceof W)) throw a;
                    return [3, 10];
                  case 10:
                    (this.totalPos += this.pos), (f.label = 11);
                  case 11:
                    return [3, 2];
                  case 12:
                    return [3, 19];
                  case 13:
                    return (h = f.sent()), (c = { error: h }), [3, 19];
                  case 14:
                    return (
                      f.trys.push([14, , 17, 18]),
                      o && !o.done && (u = i.return)
                        ? [4, O(u.call(i))]
                        : [3, 16]
                    );
                  case 15:
                    f.sent(), (f.label = 16);
                  case 16:
                    return [3, 18];
                  case 17:
                    if (c) throw c.error;
                    return [7];
                  case 18:
                    return [7];
                  case 19:
                    return [2];
                }
              });
            });
          }),
          (e.prototype.doDecodeSync = function () {
            e: for (;;) {
              var e = this.readHeadByte(),
                t = void 0;
              if (e >= 224) t = e - 256;
              else if (e < 192)
                if (e < 128) t = e;
                else if (e < 144) {
                  if (0 != (n = e - 128)) {
                    this.pushMapState(n), this.complete();
                    continue e;
                  }
                  t = {};
                } else if (e < 160) {
                  if (0 != (n = e - 144)) {
                    this.pushArrayState(n), this.complete();
                    continue e;
                  }
                  t = [];
                } else {
                  var r = e - 160;
                  t = this.decodeUtf8String(r, 0);
                }
              else if (192 === e) t = null;
              else if (194 === e) t = !1;
              else if (195 === e) t = !0;
              else if (202 === e) t = this.readF32();
              else if (203 === e) t = this.readF64();
              else if (204 === e) t = this.readU8();
              else if (205 === e) t = this.readU16();
              else if (206 === e) t = this.readU32();
              else if (207 === e) t = this.readU64();
              else if (208 === e) t = this.readI8();
              else if (209 === e) t = this.readI16();
              else if (210 === e) t = this.readI32();
              else if (211 === e) t = this.readI64();
              else if (217 === e)
                (r = this.lookU8()), (t = this.decodeUtf8String(r, 1));
              else if (218 === e)
                (r = this.lookU16()), (t = this.decodeUtf8String(r, 2));
              else if (219 === e)
                (r = this.lookU32()), (t = this.decodeUtf8String(r, 4));
              else if (220 === e) {
                if (0 !== (n = this.readU16())) {
                  this.pushArrayState(n), this.complete();
                  continue e;
                }
                t = [];
              } else if (221 === e) {
                if (0 !== (n = this.readU32())) {
                  this.pushArrayState(n), this.complete();
                  continue e;
                }
                t = [];
              } else if (222 === e) {
                if (0 !== (n = this.readU16())) {
                  this.pushMapState(n), this.complete();
                  continue e;
                }
                t = {};
              } else if (223 === e) {
                if (0 !== (n = this.readU32())) {
                  this.pushMapState(n), this.complete();
                  continue e;
                }
                t = {};
              } else if (196 === e) {
                var n = this.lookU8();
                t = this.decodeBinary(n, 1);
              } else if (197 === e)
                (n = this.lookU16()), (t = this.decodeBinary(n, 2));
              else if (198 === e)
                (n = this.lookU32()), (t = this.decodeBinary(n, 4));
              else if (212 === e) t = this.decodeExtension(1, 0);
              else if (213 === e) t = this.decodeExtension(2, 0);
              else if (214 === e) t = this.decodeExtension(4, 0);
              else if (215 === e) t = this.decodeExtension(8, 0);
              else if (216 === e) t = this.decodeExtension(16, 0);
              else if (199 === e)
                (n = this.lookU8()), (t = this.decodeExtension(n, 1));
              else if (200 === e)
                (n = this.lookU16()), (t = this.decodeExtension(n, 2));
              else {
                if (201 !== e) throw new g("Unrecognized type byte: " + z(e));
                (n = this.lookU32()), (t = this.decodeExtension(n, 4));
              }
              this.complete();
              for (var i = this.stack; i.length > 0; ) {
                var o = i[i.length - 1];
                if (0 === o.type) {
                  if (
                    ((o.array[o.position] = t),
                    o.position++,
                    o.position !== o.size)
                  )
                    continue e;
                  i.pop(), (t = o.array);
                } else {
                  if (1 === o.type) {
                    if ((void 0, "string" != (s = typeof t) && "number" !== s))
                      throw new g(
                        "The type of key must be string or number but " +
                          typeof t
                      );
                    if ("__proto__" === t)
                      throw new g("The key __proto__ is not allowed");
                    (o.key = t), (o.type = 2);
                    continue e;
                  }
                  if (
                    ((o.map[o.key] = t), o.readCount++, o.readCount !== o.size)
                  ) {
                    (o.key = null), (o.type = 1);
                    continue e;
                  }
                  i.pop(), (t = o.map);
                }
              }
              return t;
            }
            var s;
          }),
          (e.prototype.readHeadByte = function () {
            return (
              -1 === this.headByte && (this.headByte = this.readU8()),
              this.headByte
            );
          }),
          (e.prototype.complete = function () {
            this.headByte = -1;
          }),
          (e.prototype.readArraySize = function () {
            var e = this.readHeadByte();
            switch (e) {
              case 220:
                return this.readU16();
              case 221:
                return this.readU32();
              default:
                if (e < 160) return e - 144;
                throw new g("Unrecognized array type byte: " + z(e));
            }
          }),
          (e.prototype.pushMapState = function (e) {
            if (e > this.maxMapLength)
              throw new g(
                "Max length exceeded: map length (" +
                  e +
                  ") > maxMapLengthLength (" +
                  this.maxMapLength +
                  ")"
              );
            this.stack.push({
              type: 1,
              size: e,
              key: null,
              readCount: 0,
              map: {},
            });
          }),
          (e.prototype.pushArrayState = function (e) {
            if (e > this.maxArrayLength)
              throw new g(
                "Max length exceeded: array length (" +
                  e +
                  ") > maxArrayLength (" +
                  this.maxArrayLength +
                  ")"
              );
            this.stack.push({
              type: 0,
              size: e,
              array: new Array(e),
              position: 0,
            });
          }),
          (e.prototype.decodeUtf8String = function (e, t) {
            var r;
            if (e > this.maxStrLength)
              throw new g(
                "Max length exceeded: UTF-8 byte length (" +
                  e +
                  ") > maxStrLength (" +
                  this.maxStrLength +
                  ")"
              );
            if (this.bytes.byteLength < this.pos + t + e) throw V;
            var n,
              i = this.pos + t;
            return (
              (n =
                this.stateIsMapKey() &&
                (null === (r = this.keyDecoder) || void 0 === r
                  ? void 0
                  : r.canBeCached(e))
                  ? this.keyDecoder.decode(this.bytes, i, e)
                  : e > y
                  ? (function (e, t, r) {
                      var n = e.subarray(t, t + r);
                      return d.decode(n);
                    })(this.bytes, i, e)
                  : l(this.bytes, i, e)),
              (this.pos += t + e),
              n
            );
          }),
          (e.prototype.stateIsMapKey = function () {
            return (
              this.stack.length > 0 &&
              1 === this.stack[this.stack.length - 1].type
            );
          }),
          (e.prototype.decodeBinary = function (e, t) {
            if (e > this.maxBinLength)
              throw new g(
                "Max length exceeded: bin length (" +
                  e +
                  ") > maxBinLength (" +
                  this.maxBinLength +
                  ")"
              );
            if (!this.hasRemaining(e + t)) throw V;
            var r = this.pos + t,
              n = this.bytes.subarray(r, r + e);
            return (this.pos += t + e), n;
          }),
          (e.prototype.decodeExtension = function (e, t) {
            if (e > this.maxExtLength)
              throw new g(
                "Max length exceeded: ext length (" +
                  e +
                  ") > maxExtLength (" +
                  this.maxExtLength +
                  ")"
              );
            var r = this.view.getInt8(this.pos + t),
              n = this.decodeBinary(e, t + 1);
            return this.extensionCodec.decode(n, r, this.context);
          }),
          (e.prototype.lookU8 = function () {
            return this.view.getUint8(this.pos);
          }),
          (e.prototype.lookU16 = function () {
            return this.view.getUint16(this.pos);
          }),
          (e.prototype.lookU32 = function () {
            return this.view.getUint32(this.pos);
          }),
          (e.prototype.readU8 = function () {
            var e = this.view.getUint8(this.pos);
            return this.pos++, e;
          }),
          (e.prototype.readI8 = function () {
            var e = this.view.getInt8(this.pos);
            return this.pos++, e;
          }),
          (e.prototype.readU16 = function () {
            var e = this.view.getUint16(this.pos);
            return (this.pos += 2), e;
          }),
          (e.prototype.readI16 = function () {
            var e = this.view.getInt16(this.pos);
            return (this.pos += 2), e;
          }),
          (e.prototype.readU32 = function () {
            var e = this.view.getUint32(this.pos);
            return (this.pos += 4), e;
          }),
          (e.prototype.readI32 = function () {
            var e = this.view.getInt32(this.pos);
            return (this.pos += 4), e;
          }),
          (e.prototype.readU64 = function () {
            var e,
              t,
              r =
                ((e = this.view),
                (t = this.pos),
                4294967296 * e.getUint32(t) + e.getUint32(t + 4));
            return (this.pos += 8), r;
          }),
          (e.prototype.readI64 = function () {
            var e = i(this.view, this.pos);
            return (this.pos += 8), e;
          }),
          (e.prototype.readF32 = function () {
            var e = this.view.getFloat32(this.pos);
            return (this.pos += 4), e;
          }),
          (e.prototype.readF64 = function () {
            var e = this.view.getFloat64(this.pos);
            return (this.pos += 8), e;
          }),
          e
        );
      })(),
      H = {};
    function N(e, t) {
      return (
        void 0 === t && (t = H),
        new R(
          t.extensionCodec,
          t.context,
          t.maxStrLength,
          t.maxBinLength,
          t.maxArrayLength,
          t.maxMapLength,
          t.maxExtLength
        ).decode(e)
      );
    }
    function G(e, t) {
      return (
        void 0 === t && (t = H),
        new R(
          t.extensionCodec,
          t.context,
          t.maxStrLength,
          t.maxBinLength,
          t.maxArrayLength,
          t.maxMapLength,
          t.maxExtLength
        ).decodeMulti(e)
      );
    }
    var X = function (e, t) {
        var r,
          n,
          i,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & i[0]) throw i[1];
              return i[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (o = { next: a(0), throw: a(1), return: a(2) }),
          "function" == typeof Symbol &&
            (o[Symbol.iterator] = function () {
              return this;
            }),
          o
        );
        function a(o) {
          return function (a) {
            return (function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s; )
                try {
                  if (
                    ((r = 1),
                    n &&
                      (i =
                        2 & o[0]
                          ? n.return
                          : o[0]
                          ? n.throw || ((i = n.return) && i.call(n), 0)
                          : n.next) &&
                      !(i = i.call(n, o[1])).done)
                  )
                    return i;
                  switch (((n = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, { value: o[1], done: !1 };
                    case 5:
                      s.label++, (n = o[1]), (o = [0]);
                      continue;
                    case 7:
                      (o = s.ops.pop()), s.trys.pop();
                      continue;
                    default:
                      if (
                        !(
                          (i = (i = s.trys).length > 0 && i[i.length - 1]) ||
                          (6 !== o[0] && 2 !== o[0])
                        )
                      ) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        (s.label = i[1]), (i = o);
                        break;
                      }
                      if (i && s.label < i[2]) {
                        (s.label = i[2]), s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  (o = [6, e]), (n = 0);
                } finally {
                  r = i = 0;
                }
              if (5 & o[0]) throw o[1];
              return { value: o[0] ? o[1] : void 0, done: !0 };
            })([o, a]);
          };
        }
      },
      q = function (e) {
        return this instanceof q ? ((this.v = e), this) : new q(e);
      },
      J = function (e, t, r) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          i = r.apply(e, t || []),
          o = [];
        return (
          (n = {}),
          s("next"),
          s("throw"),
          s("return"),
          (n[Symbol.asyncIterator] = function () {
            return this;
          }),
          n
        );
        function s(e) {
          i[e] &&
            (n[e] = function (t) {
              return new Promise(function (r, n) {
                o.push([e, t, r, n]) > 1 || a(e, t);
              });
            });
        }
        function a(e, t) {
          try {
            (r = i[e](t)).value instanceof q
              ? Promise.resolve(r.value.v).then(h, c)
              : u(o[0][2], r);
          } catch (e) {
            u(o[0][3], e);
          }
          var r;
        }
        function h(e) {
          a("next", e);
        }
        function c(e) {
          a("throw", e);
        }
        function u(e, t) {
          e(t), o.shift(), o.length && a(o[0][0], o[0][1]);
        }
      };
    function Q(e) {
      if (null == e)
        throw new Error(
          "Assertion Failure: value must not be null nor undefined"
        );
    }
    function Y(e) {
      return null != e[Symbol.asyncIterator]
        ? e
        : (function (e) {
            return J(this, arguments, function () {
              var t, r, n, i;
              return X(this, function (o) {
                switch (o.label) {
                  case 0:
                    (t = e.getReader()), (o.label = 1);
                  case 1:
                    o.trys.push([1, , 9, 10]), (o.label = 2);
                  case 2:
                    return [4, q(t.read())];
                  case 3:
                    return (
                      (r = o.sent()),
                      (n = r.done),
                      (i = r.value),
                      n ? [4, q(void 0)] : [3, 5]
                    );
                  case 4:
                    return [2, o.sent()];
                  case 5:
                    return Q(i), [4, q(i)];
                  case 6:
                    return [4, o.sent()];
                  case 7:
                    return o.sent(), [3, 2];
                  case 8:
                    return [3, 10];
                  case 9:
                    return t.releaseLock(), [7];
                  case 10:
                    return [2];
                }
              });
            });
          })(e);
    }
    function Z(e, t) {
      return (
        void 0 === t && (t = H),
        (r = this),
        (n = void 0),
        (o = function () {
          var r;
          return (function (e, t) {
            var r,
              n,
              i,
              o,
              s = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: a(0), throw: a(1), return: a(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function a(o) {
              return function (a) {
                return (function (o) {
                  if (r) throw new TypeError("Generator is already executing.");
                  for (; s; )
                    try {
                      if (
                        ((r = 1),
                        n &&
                          (i =
                            2 & o[0]
                              ? n.return
                              : o[0]
                              ? n.throw || ((i = n.return) && i.call(n), 0)
                              : n.next) &&
                          !(i = i.call(n, o[1])).done)
                      )
                        return i;
                      switch (((n = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return s.label++, { value: o[1], done: !1 };
                        case 5:
                          s.label++, (n = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = s.ops.pop()), s.trys.pop();
                          continue;
                        default:
                          if (
                            !(
                              (i =
                                (i = s.trys).length > 0 && i[i.length - 1]) ||
                              (6 !== o[0] && 2 !== o[0])
                            )
                          ) {
                            s = 0;
                            continue;
                          }
                          if (
                            3 === o[0] &&
                            (!i || (o[1] > i[0] && o[1] < i[3]))
                          ) {
                            s.label = o[1];
                            break;
                          }
                          if (6 === o[0] && s.label < i[1]) {
                            (s.label = i[1]), (i = o);
                            break;
                          }
                          if (i && s.label < i[2]) {
                            (s.label = i[2]), s.ops.push(o);
                            break;
                          }
                          i[2] && s.ops.pop(), s.trys.pop();
                          continue;
                      }
                      o = t.call(e, s);
                    } catch (e) {
                      (o = [6, e]), (n = 0);
                    } finally {
                      r = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, a]);
              };
            }
          })(this, function (n) {
            return (
              (r = Y(e)),
              [
                2,
                new R(
                  t.extensionCodec,
                  t.context,
                  t.maxStrLength,
                  t.maxBinLength,
                  t.maxArrayLength,
                  t.maxMapLength,
                  t.maxExtLength
                ).decodeAsync(r),
              ]
            );
          });
        }),
        new ((i = void 0) || (i = Promise))(function (e, t) {
          function s(e) {
            try {
              h(o.next(e));
            } catch (e) {
              t(e);
            }
          }
          function a(e) {
            try {
              h(o.throw(e));
            } catch (e) {
              t(e);
            }
          }
          function h(t) {
            var r;
            t.done
              ? e(t.value)
              : ((r = t.value),
                r instanceof i
                  ? r
                  : new i(function (e) {
                      e(r);
                    })).then(s, a);
          }
          h((o = o.apply(r, n || [])).next());
        })
      );
      var r, n, i, o;
    }
    function $(e, t) {
      void 0 === t && (t = H);
      var r = Y(e);
      return new R(
        t.extensionCodec,
        t.context,
        t.maxStrLength,
        t.maxBinLength,
        t.maxArrayLength,
        t.maxMapLength,
        t.maxExtLength
      ).decodeArrayStream(r);
    }
    function ee(e, t) {
      void 0 === t && (t = H);
      var r = Y(e);
      return new R(
        t.extensionCodec,
        t.context,
        t.maxStrLength,
        t.maxBinLength,
        t.maxArrayLength,
        t.maxMapLength,
        t.maxExtLength
      ).decodeStream(r);
    }
    function te(e, t) {
      return void 0 === t && (t = H), ee(e, t);
    }
    return t;
  })();
});

var Physics = pc.createScript("physics");
Physics.attributes.add("friction", {
  type: "number",
  default: 10,
  description: "Default ground friction",
}),
  Physics.attributes.add("gravity", {
    type: "number",
    default: 2.4,
    description: "Default gravity",
  }),
  Physics.attributes.add("grid", { type: "entity" }),
  (Physics.prototype.initialize = function () {
    (this.app.physics = this), (this._kinematicBodies = []);
  }),
  (Physics.prototype.postInitialize = function () {
    this._setUpCollisions();
  }),
  (Physics.prototype._setUpCollisions = function () {
    let i = this.app.root.findComponents("collision");
    for (let t in i) {
      let o = i[t].entity;
      !1 === o.enabled ||
        o.tags.has("hollow") ||
        (o.tags.has("ramp") && this._setRampRotation(o),
        o.isKinematic && this._kinematicBodies.push(o),
        (o.collisionPos = this._getCollisionPos(o).clone()),
        this.grid.script.grid3d.add(o));
    }
  }),
  (Physics.prototype._setRampRotation = function (i) {
    const t = i.getEulerAngles();
    let o = t.x,
      s = t.y,
      e = t.z;
    (o = ((o % 360) + 360) % 360),
      (s = ((s % 360) + 360) % 360),
      (e = ((e % 360) + 360) % 360),
      o > 180 && (o -= 360),
      s > 180 && (s -= 360),
      e > 180 && (e -= 360),
      -180 === o && (o = 180),
      -180 === e && (e = 180),
      0 === o && 0 === s && 0 === e
        ? (i.rotationId = 0)
        : 0 === o && -90 === s && 0 === e
        ? (i.rotationId = 1)
        : 180 === o && 0 === s && 180 === e
        ? (i.rotationId = 2)
        : 0 === o && 90 === s && 0 === e
        ? (i.rotationId = 3)
        : console.warn(
            "warning, failed to set ramp angle for euler x: " +
              o +
              " y: " +
              s +
              " z: " +
              e
          );
  }),
  (Physics.prototype.resolveCollisions = function (i, t) {
    const o = this.grid.script.grid3d.getEntitiesNearby(i.getPosition()),
      s = o.ramps,
      e = o.cuboids,
      n = o.cylinders;
    for (let t in s) this._resolveEntityRampCollision(i, s[t]);
    for (let t in e) this._resolveEntityCuboidCollision(i, e[t]);
    for (let t in n) this._resolveEntityCylinderCollision(i, n[t]);
  }),
  (Physics.prototype._resolveEntityCuboidCollision = function (i, t) {
    if (t.skipCollision) return;
    let o = this._getCollisionPos(i),
      s = t.collisionPos;
    t.isKinematic && t.collisionPos.copy(this._getCollisionPos(t));
    let e = i.collision.halfExtents,
      n = t.collision.halfExtents,
      l = n.x,
      y = n.z,
      r = t.getEulerAngles().y;
    if (
      ((-90 != r && 90 != r && -270 != r && 270 != r) || ((l = n.z), (y = n.x)),
      s.x + l <= o.x - e.x)
    )
      return;
    if (s.x - l >= o.x + e.x) return;
    if (s.y + n.y <= o.y - e.y) return;
    if (s.y - n.y >= o.y + e.y) return;
    if (s.z + y <= o.z - e.z) return;
    if (s.z - y >= o.z + e.z) return;
    let a = { x: 0, y: 0, z: 0 };
    s.x <= o.x ? (a.x = o.x - e.x - (s.x + l)) : (a.x = o.x + e.x - (s.x - l)),
      s.y <= o.y
        ? (a.y = o.y - e.y - (s.y + n.y))
        : (a.y = o.y + e.y - (s.y - n.y)),
      s.z <= o.z
        ? (a.z = o.z - e.z - (s.z + y))
        : (a.z = o.z + e.z - (s.z - y));
    let z = { x: a.x, y: a.y, z: a.z };
    a.x < 0 && (z.x = Math.abs(a.x)),
      a.y < 0 && (z.y = Math.abs(a.y)),
      a.z < 0 && (z.z = Math.abs(a.z));
    let x = !1,
      c = !1,
      f = !1;
    z.x < z.y && z.x < z.z
      ? (x = !0)
      : z.y < z.x && z.y < z.z
      ? (c = !0)
      : z.z < z.x && z.z < z.y && (f = !0);
    let p = o;
    x
      ? ((p.x -= a.x), i.fire("collide:x"))
      : c
      ? ((p.y -= a.y),
        o.y >= s.y + n.y && i.fire("land"),
        t.isKinematic &&
          ((p.x += t.collisionPos.x - t.prevPos.x),
          (p.z += t.collisionPos.z - t.prevPos.z)))
      : f && ((p.z -= a.z), i.fire("collide:z")),
      this._setEntityPos(i, p);
  }),
  (Physics.prototype._resolveEntityCylinderCollision = function (i, t) {
    let o = this._getCollisionPos(i),
      s = t.collisionPos,
      e = i.collision.halfExtents,
      n = t.collision.radius,
      l = t.collision.height / 2;
    t.collision.radius;
    if (s.y + l <= o.y - e.y) return;
    if (s.y - l >= o.y + e.y) return;
    let y = { x: o.x - s.x, y: o.y - s.y, z: o.z - s.z },
      r = Math.hypot(y.x, y.z),
      a = n + e.x - r;
    if (a < 0) return;
    s.y <= o.y ? (y.y = o.y - e.y - (s.y + l)) : (y.y = o.y + e.y - (s.y - l)),
      (y.x /= r),
      (y.z /= r),
      (y.x *= a),
      (y.z *= a);
    let z = { x: y.x, y: y.y, z: y.z };
    y.y < 0 && (z.y = Math.abs(z.y));
    let x = !1,
      c = Math.hypot(z.x, z.z);
    z.y < c && (x = !0),
      x ? ((o.y -= y.y), i.fire("land")) : ((o.x += y.x), (o.z += y.z)),
      this._setEntityPos(i, o);
  }),
  (Physics.prototype._resolveEntityRampCollision = function (i, t) {
    let o = this._getCollisionPos(i),
      s = t.collisionPos,
      e = i.collision.halfExtents,
      n = t.collision.halfExtents;
    if (s.y + n.y <= o.y - e.y) return;
    if (s.y - n.y >= o.y + e.y) return;
    if (1 == t.rotationId || 3 == t.rotationId) {
      if (s.x + n.z <= o.x - e.x) return;
      if (s.x - n.z >= o.x + e.x) return;
      if (s.z + n.x <= o.z - e.z) return;
      if (s.z - n.x >= o.z + e.z) return;
    } else {
      if (s.x + n.x <= o.x - e.x) return;
      if (s.x - n.x >= o.x + e.x) return;
      if (s.z + n.z <= o.z - e.z) return;
      if (s.z - n.z >= o.z + e.z) return;
    }
    let l = n.z + (o.z - s.z + +e.z),
      y = n.y / n.z;
    2 == t.rotationId
      ? (l = n.z - (o.z - s.z - e.z))
      : 3 == t.rotationId
      ? (l = n.z + (o.x - s.x + e.x))
      : 1 == t.rotationId
      ? (l = n.z - (o.x - s.x - e.x))
      : 0 == t.rotationId && (l = n.z + (o.z - s.z + e.z));
    let r = y * l + (s.y - n.y);
    r > s.y + n.y && (r = s.y + n.y),
      o.y - e.y < r && ((o.y = r + e.y), i.fire("land")),
      this._setEntityPos(i, o);
  }),
  (Physics.prototype._getCollisionPos = function (i) {
    let t = i.getPosition();
    return (
      (t.x += i.collision.linearOffset.x),
      (t.y += i.collision.linearOffset.y),
      (t.z += i.collision.linearOffset.z),
      t
    );
  }),
  (Physics.prototype._setEntityPos = function (i, t) {
    (t.x -= i.collision.linearOffset.x),
      (t.y -= i.collision.linearOffset.y),
      (t.z -= i.collision.linearOffset.z),
      i.setPosition(t);
  }),
  (Physics.prototype.postUpdate = function (i) {
    for (let i in this.app.remotePlayers)
      if (this.app.remotePlayers.hasOwnProperty(i)) {
        let t = this.app.remotePlayers[i];
        if (t)
          for (let i in this._kinematicBodies) {
            let o = this._kinematicBodies[i];
            this._resolveEntityCuboidCollision(t, o);
          }
      }
  });
var Grid3d = pc.createScript("grid3d");
Grid3d.attributes.add("nodeWidth", {
  type: "number",
  default: 25,
  description: "Width in game units of each cube-shaped grid cell",
}),
  Grid3d.attributes.add("maxRange", {
    type: "number",
    default: 100,
    description: "The maximum range of the grid in game units",
  }),
  (Grid3d.prototype.initialize = function () {
    (this._GRID_SIZE = (2 * this.maxRange) / this.nodeWidth),
      (this._largeElements = []),
      (this._nodes = []),
      this._build();
  }),
  (Grid3d.prototype._build = function () {
    for (let t = 0; t < this._GRID_SIZE; ++t) {
      let t = [];
      for (let i = 0; i < this._GRID_SIZE; ++i) {
        let i = [];
        for (let t = 0; t < this._GRID_SIZE; ++t) {
          let t = [];
          i.push(t);
        }
        t.push(i);
      }
      this._nodes.push(t);
    }
  }),
  (Grid3d.prototype.add = function (t) {
    if (t.collision)
      if (
        (t.tags.has("cuboid")
          ? (t.shapeId = 0)
          : t.tags.has("cylinder")
          ? (t.shapeId = 1)
          : t.tags.has("ramp") && (t.shapeId = 2),
        2 * t.collision.halfExtents.x > this.nodeWidth ||
          2 * t.collision.halfExtents.y > this.nodeWidth ||
          2 * t.collision.halfExtents.z > this.nodeWidth)
      )
        this._addToLargeElements(t);
      else {
        let i = this._getGridAddressFromPosition(t.getPosition());
        (t.gridAddress = i), this._nodes[i.x][i.y][i.z].push(t);
      }
  }),
  (Grid3d.prototype._addToLargeElements = function (t) {
    (t.gridAddress = { x: 0, y: 0, z: 0, inLargeEntities: !0 }),
      this._largeElements.push(t);
  }),
  (Grid3d.prototype._getGridAddressFromPosition = function (t) {
    let i = { x: 0, y: 0, z: 0, inLargeEntities: !0 };
    return (
      (i.x = this._getAddressNumWithinRangeBounds(
        Math.floor(t.x / this.nodeWidth) + this._GRID_SIZE / 2
      )),
      (i.y = this._getAddressNumWithinRangeBounds(
        Math.floor(t.y / this.nodeWidth) + this._GRID_SIZE / 2
      )),
      (i.z = this._getAddressNumWithinRangeBounds(
        Math.floor(t.z / this.nodeWidth) + this._GRID_SIZE / 2
      )),
      i
    );
  }),
  (Grid3d.prototype._getAddressNumWithinRangeBounds = function (t) {
    return t < 0 ? 0 : t >= this._GRID_SIZE ? this._GRID_SIZE - 1 : t;
  }),
  (Grid3d.prototype.getEntitiesNearby = function (t) {
    let i = [],
      e = [],
      s = [];
    this._categorize(this._largeElements, i, e, s);
    let d = this._getGridAddressFromPosition(t),
      n = this._getLimits(d);
    for (let t = n.minX; t <= n.maxX; ++t)
      for (let d = n.minY; d <= n.maxY; ++d)
        for (let o = n.minZ; o <= n.maxZ; ++o)
          this._categorize(this._nodes[t][d][o], i, e, s);
    return { cuboids: i, ramps: e, cylinders: s };
  }),
  (Grid3d.prototype._categorize = function (t, i, e, s) {
    t.forEach((t) => {
      0 === t.shapeId
        ? i.push(t)
        : 1 === t.shapeId
        ? s.push(t)
        : 2 === t.shapeId && e.push(t);
    });
  }),
  (Grid3d.prototype._getLimits = function (t) {
    return {
      minX: this._getAddressNumWithinRangeBounds(t.x - 1),
      maxX: this._getAddressNumWithinRangeBounds(t.x + 1),
      minY: this._getAddressNumWithinRangeBounds(t.y - 1),
      maxY: this._getAddressNumWithinRangeBounds(t.y + 1),
      minZ: this._getAddressNumWithinRangeBounds(t.z - 1),
      maxZ: this._getAddressNumWithinRangeBounds(t.z + 1),
    };
  });
var DbItem = pc.createScript("dbItem");
DbItem.attributes.add("mesh", { type: "asset" }),
  DbItem.attributes.add("materials", {
    type: "asset",
    assetType: "material",
    array: !0,
  }),
  DbItem.attributes.add("isNoneItem", { type: "boolean", default: !1 }),
  DbItem.attributes.add("uiSprite", { type: "asset", assetType: "sprite" }),
  DbItem.attributes.add("itemCat", {
    type: "string",
    enum: [
      { Hair: "hair" },
      { Tops: "tops" },
      { Dresses: "dresses" },
      { Bottoms: "bottoms" },
      { Shoes: "shoes" },
      { Neck: "neck" },
      { Ear: "ear" },
      { Wrist: "wrist" },
      { Eyes: "eyes" },
      { Cheek: "cheek" },
      { Lips: "lips" },
      { Hat: "hats" },
      { Belts: "belts" },
      { Glasses: "glasses" },
      { Bags: "bags" },
      { Coats: "coats" },
      { HeadAccs: "headAccs" },
      { Handhelds: "handhelds" },
      { Back: "back" },
    ],
  }),
  DbItem.attributes.add("heelHeight", {
    type: "string",
    enum: [
      { "N/A": "null" },
      { Heel1: "heel1" },
      { Heel2: "heel2" },
      { Heel3: "heel3" },
      { Heel4: "heel4" },
      { Heel5: "heel5" },
    ],
  }),
  DbItem.attributes.add("waistHeight", {
    type: "string",
    default: "na",
    enum: [{ na: "na" }, { Low: "Low" }, { Mid: "Mid" }, { High: "High" }],
  }),
  DbItem.attributes.add("customArm", { type: "boolean", default: !1 }),
  DbItem.attributes.add("communalLeg", {
    type: "string",
    default: "na",
    enum: [
      { na: "na" },
      { Knee: "knee" },
      { Thigh: "thigh" },
      { Full: "full" },
    ],
  }),
  DbItem.attributes.add("bagPose", {
    type: "number",
    description: "na:0, shoulder: 1, elbow: 2, hand: 3",
    default: 0,
  }),
  DbItem.attributes.add("handheldPose", {
    type: "number",
    description: "na:0, smallItem: 1, largeItem: 2",
    default: 0,
  }),
  DbItem.attributes.add("colorSlots", { type: "number", default: 1 }),
  DbItem.attributes.add("color1", { type: "string", default: "white" }),
  DbItem.attributes.add("color2", { type: "string", default: "white" }),
  DbItem.attributes.add("color3", { type: "string", default: "white" }),
  DbItem.attributes.add("hasStaticColor", {
    type: "boolean",
    default: !1,
    description: "For plants and other items that have fixed colors",
  }),
  DbItem.attributes.add("staticColor", {
    type: "rgb",
    description: "(Optional) Used for tinting player effects",
  }),
  DbItem.attributes.add("isVIP", { type: "boolean", default: !1 }),
  DbItem.attributes.add("isPremium", { type: "boolean", default: !1 }),
  DbItem.attributes.add("redeemCode", {
    type: "string",
    default: "",
    description: "Item will only unlock if user enters the code",
  }),
  DbItem.attributes.add("linkedGardenItemId", {
    type: "string",
    description:
      "(Optional) If associated with a garden item, eg plant_petal_poppy_yellow",
  }),
  DbItem.attributes.add("variations", { type: "asset", array: !0 }),
  DbItem.attributes.add("eventCurrency", {
    type: "string",
    default: "",
    description:
      "(Optional) If associated with a collectible event. Must match eventPrefix in collectible.js",
  }),
  DbItem.attributes.add("collectibleCost", {
    type: "number",
    default: 0,
    description: "(Optional) If associated with a collectible event.",
  }),
  DbItem.attributes.add("isPrize", { type: "boolean", default: !1 }),
  (DbItem.prototype.getContainerAsset = function () {
    if (this.mesh && this.mesh.data && this.mesh.data.containerAsset) {
      const t = this.app.assets.get(this.mesh.data.containerAsset);
      if (t) return t;
    }
    return null;
  });
var ItemDb = pc.createScript("itemDb");
(ItemDb.prototype.initialize = function () {
  this.app.itemDb = this;
}),
  (ItemDb.prototype.getItem = function (t) {
    let e = this.entity.findByName(t);
    return e ? e.script.dbItem : (console.error("Item not found: " + t), null);
  }),
  (ItemDb.prototype.getCategory = function (t) {
    let e = this.entity.findByName(t);
    return e || (console.error("Category not found: " + t), null);
  });
var ResetOutfit = pc.createScript("resetOutfit");
ResetOutfit.attributes.add("resetButton", { type: "entity" }),
  ResetOutfit.attributes.add("defaults", {
    type: "json",
    array: !0,
    description: "What to reset to.",
    schema: [
      { name: "slot", type: "entity" },
      { name: "item", type: "entity" },
      {
        name: "enable",
        type: "boolean",
        default: !0,
        description: "Should the slot be enabled upon reset?",
      },
      {
        name: "isClothingItem",
        type: "boolean",
        description: "Whether to use body materials or clothing materials",
      },
    ],
  }),
  (ResetOutfit.prototype.initialize = function () {
    this.resetButton.button.on(
      "click",
      function () {
        this.resetOutfit();
      },
      this
    );
  }),
  (ResetOutfit.prototype.resetOutfit = function () {
    this.app.fire("longChimes");
    let t = this.app.globals.localOutfit,
      e = t.selection;
    e.tops.waistHeight = "Low";
    for (let i = 0; i < this.defaults.length; i++) {
      let s = this.defaults[i],
        a = s.slot,
        o = s.item.script.dbItem,
        l = o.itemCat;
      (e[l].selected = o.entity.name),
        s.isClothingItem
          ? ((e[l].color1 = "white"),
            (e[l].color2 = "white"),
            (e[l].color3 = "white"),
            t.wearItem(a.name, e[l]))
          : t.wearItem(a.name, e[l]),
        s.enable ? (a.enabled = !0) : (a.enabled = !1);
    }
    t.setDressState(!0),
      (e.isWearingHat = !1),
      this.app.globals.localCharAnims.setBagPose(0),
      this.app.globals.localCharAnims.setHandheldPose(0),
      this.app.fire("resetOutfitSparkles"),
      this.app.saveStats("player", e.selection),
      (this.app.globals.outfitWasChanged = !0);
  });
var ColorDb = pc.createScript("colorDb");
(ColorDb.prototype.initialize = function () {
  (this.app.colorDb = this),
    (this.hairColorItems = []),
    (this.skinColorItems = []),
    (this.eyeColorItems = []),
    (this.lipColorItems = []),
    (this.blushColorItems = []);
}),
  (ColorDb.prototype.getMaterial = function (o) {
    let t = this.entity.findByName(o);
    return t || ((o = o.toUpperCase()), (t = this.entity.findByName(o)), t)
      ? t.script.dbItemColor.material
      : (console.error(
          "Color not found: " + o + " no upper or lowercase match"
        ),
        null);
  });
var StopPropagation = pc.createScript("stopPropagation");
StopPropagation.attributes.add("elements", {
  type: "entity",
  array: !0,
  description:
    "We will call stopPropagation() when mousedown and touchstart events are detected on these elements.",
}),
  StopPropagation.attributes.add("buttons", {
    type: "entity",
    array: !0,
    description:
      "We will call stopPropagation() when mousedown, touchstart, touchmove events are detected on these buttons.",
  }),
  (StopPropagation.prototype.initialize = function () {
    for (let t in this.elements) {
      let o = this.elements[t].element;
      o &&
        (o.on("mousedown", this._stopPropagation, this),
        o.on("touchstart", this._stopPropagation, this),
        o.on("touchmove", this._stopPropagation, this));
    }
    for (let t in this.buttons) {
      let o = this.buttons[t].button;
      o &&
        (o.on("mousedown", this._stopPropagation, this),
        o.on("touchstart", this._stopPropagation, this),
        o.on("touchmove", this._stopPropagation, this));
    }
  }),
  (StopPropagation.prototype._stopPropagation = function (t) {
    t.stopPropagation();
  });
var ControlManager = pc.createScript("controlManager");
(ControlManager.prototype.initialize = function () {
  (this.app.isUsingTouch = !1),
    (this.app.isTouchPortrait = !1),
    pc.platform.mobile &&
      pc.platform.touch &&
      ((this.app.isUsingTouch = !0),
      this.app.graphicsDevice.height > this.app.graphicsDevice.width
        ? (this.app.isTouchPortrait = !0)
        : this.app.graphicsDevice.width >= this.app.graphicsDevice.height &&
          (this.app.isTouchPortrait = !1)),
    this.app.touch &&
      this.app.touch.on(pc.EVENT_TOUCHSTART, this._onTouchStart, this),
    this.app.keyboard &&
      this.app.keyboard.on(pc.EVENT_KEYDOWN, this._onKeyDown, this),
    window.addEventListener("blur", this._onBlur.bind(this)),
    window.addEventListener("resize", this._onResize.bind(this)),
    document.addEventListener("contextmenu", (i) => i.preventDefault()),
    window.addEventListener("keydown", (i) => {
      let t = ["ArrowDown", "ArrowUp", " "];
      this.app.globals.formInputOpen && (t = ["ArrowDown", "ArrowUp"]),
        t.includes(i.key) &&
          !this.app.globals.keyboardMovementBlocked &&
          i.preventDefault();
    }),
    window.addEventListener("wheel", (i) => i.preventDefault(), {
      passive: !1,
    });
}),
  (ControlManager.prototype._onTouchStart = function () {
    this.app.isUsingTouch ||
      ((this.app.isUsingTouch = !0),
      this.app.graphicsDevice.height > this.app.graphicsDevice.width
        ? (this.app.isTouchPortrait = !0)
        : this.app.graphicsDevice.width >= this.app.graphicsDevice.height &&
          (this.app.isTouchPortrait = !1),
      this.app.fire("ui:touch:state:update"));
  }),
  (ControlManager.prototype._onKeyDown = function (i) {
    this.app.isUsingTouch &&
      this._isMovementKey(i.key) &&
      ((this.app.isUsingTouch = !1),
      (this.app.isTouchPortrait = !1),
      this.app.fire("ui:touch:state:update"));
  }),
  (ControlManager.prototype._isMovementKey = function (i) {
    return (
      i === pc.KEY_A ||
      i === pc.KEY_LEFT ||
      i === pc.KEY_D ||
      i === pc.KEY_RIGHT ||
      i === pc.KEY_W ||
      i === pc.KEY_UP ||
      i === pc.KEY_S ||
      i === pc.KEY_DOWN ||
      i === pc.KEY_SPACE
    );
  }),
  (ControlManager.prototype._onBlur = function () {
    this.app.fire("window:blur");
  }),
  (ControlManager.prototype._onResize = function () {
    this.app.isUsingTouch
      ? this.app.graphicsDevice.height > this.app.graphicsDevice.width
        ? (this.app.isTouchPortrait = !0)
        : this.app.graphicsDevice.width >= this.app.graphicsDevice.height &&
          (this.app.isTouchPortrait = !1)
      : (this.app.isTouchPortrait = !1),
      this.app.fire("resize");
  });
var UiDbItemList = pc.createScript("UiDbItemList");
UiDbItemList.attributes.add("uiItemTemplate", {
  type: "asset",
  assetType: "template",
  description:
    "The template that will be instantiated and added to the UI scrollviews",
}),
  UiDbItemList.attributes.add("groups", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "dbItemGroup",
        type: "entity",
        description:
          "The parent entity that contains the dbItems we'd like to show in this list",
      },
      {
        name: "scrollViewContent",
        type: "entity",
        description: "The entity that contains the LayoutGroup component",
      },
    ],
    description: "The groups of dbItems to show in this list",
  }),
  (UiDbItemList.prototype.initialize = function () {
    this.app.on("code:redeemed", this._onCodeRedeemed, this),
      this.app.on("prize:open", this._onPrizeOpen, this),
      this.app.on("codes:redeemed:loaded", this._createAllUiItems, this);
  }),
  (UiDbItemList.prototype._onCodeRedeemed = function (e) {
    if (e && 0 !== e.length)
      for (let t in this.groups) {
        const i = this.groups[t];
        let n = i.dbItemGroup;
        for (let t in n.children) {
          const s = n.children[t];
          if (!1 === s.enabled) continue;
          if (s.tags.has("plant")) continue;
          const o = s.script.dbItem;
          if (
            o &&
            o.redeemCode &&
            !(o.redeemCode.length <= 0) &&
            !o.isPrize &&
            o.redeemCode.toUpperCase() == e
          )
            return (
              this._createUiItem(o, i),
              void this.app.fire("updatePanelContents")
            );
        }
      }
  }),
  (UiDbItemList.prototype._onPrizeOpen = function (e) {
    console.log("onPrizeOpen", e);
    for (let t in this.groups) {
      const i = this.groups[t];
      let n = i.dbItemGroup;
      for (let t in n.children) {
        const s = n.children[t];
        if (!1 === s.enabled) continue;
        if (s.tags.has("plant")) continue;
        const o = s.script.dbItem;
        if (o && o.isPrize && o.entity.name == e)
          return (
            console.log("creating", e),
            this._createUiItem(o, i),
            void this.app.fire("updatePanelContents")
          );
      }
    }
  }),
  (UiDbItemList.prototype._createUiItem = function (e, t) {
    const i = this.uiItemTemplate.resource.instantiate();
    (i.name = e.entity.name),
      (i.element.spriteAsset = e.uiSprite),
      t.scrollViewContent.addChild(i);
    let n = i.script.fashionItem;
    if (((n.dbItem = e), e.eventCurrency.length > 0 && e.collectibleCost > 0)) {
      !1 === (-1 !== this.app.globals.unlockedItems.indexOf(e.entity.name)) &&
        n.setCollectiblePurchaseCost(e.eventCurrency, e.collectibleCost);
    }
    e.isPremium ? (n.adIcon.enabled = !0) : (n.adIcon.enabled = !1),
      (n.isVIP = e.isVIP),
      (n.itemCat = e.itemCat),
      (n.isPremium = e.isPremium);
  }),
  (UiDbItemList.prototype._createAllUiItems = function () {
    for (let e in this.groups) {
      const t = this.groups[e];
      let i = t.dbItemGroup;
      for (let e in i.children) {
        const n = i.children[e];
        if (!1 === n.enabled) continue;
        if (n.tags.has("plant")) continue;
        const s = n.script.dbItem;
        s &&
          ((s.redeemCode &&
            s.redeemCode.length > 0 &&
            !this.app.codes.isCodeRedeemed(s.redeemCode)) ||
            (s.isPrize &&
              -1 == this.app.globals.unlockedItems.indexOf(s.entity.name)) ||
            this._createUiItem(s, t));
      }
    }
  });
var AssetLoader = pc.createScript("assetLoader");
AssetLoader.attributes.add("startEvent", {
  type: "string",
  default: "poki:ready",
  description:
    "Listens for this event. When detected, assets will begin to download.",
}),
  AssetLoader.attributes.add("finishEvent", {
    type: "string",
    description:
      "(Optional) This event will be fired once all assets have finished downloading.",
  }),
  AssetLoader.attributes.add("assets", {
    type: "json",
    array: !0,
    schema: [{ name: "asset", type: "asset" }],
  }),
  (AssetLoader.prototype.initialize = function () {
    this.app.once(this.startEvent, this._onEvent, this);
  }),
  (AssetLoader.prototype._onEvent = function () {
    (this._numWaiting = this.assets.length), this.entity.fire("start");
    for (let t in this.assets)
      this.app.assets.load(this.assets[t].asset),
        this.assets[t].asset.ready(() => {
          this._numWaiting--,
            0 == this._numWaiting &&
              (this.app.fire(this.finishEvent, this.assets),
              this.entity.fire("finish"));
        });
  });
var Spinner = pc.createScript("spinner");
Spinner.attributes.add("spinSpeed", { type: "number", default: 1.5 }),
  (Spinner.prototype.update = function (e) {
    let t = e / (1 / 60);
    this.entity.rotateLocal(0, 0, -this.spinSpeed * t);
  });
var AssetLoadingSystem = pc.createScript("assetLoadingSystem");
AssetLoadingSystem.attributes.add("entityGroups", {
  type: "json",
  array: !0,
  schema: [
    {
      name: "entityGroup",
      type: "entity",
      description: "Parent node to enable",
    },
    {
      name: "EnableOnEvent",
      type: "string",
      description: "Event on which to enable entityGroup",
    },
  ],
}),
  AssetLoadingSystem.attributes.add("assetGroups", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "name",
        type: "string",
        description:
          "Name of the group. Use this to pass onload callbacks: app.afterGroupLoaded(name, callback)",
      },
      {
        name: "forceInstancerUpdate",
        type: "boolean",
        default: !1,
        description:
          "Instancer will be forced to update on the next frame on load. Set true for asset groups that contains meshes.",
      },
      {
        name: "entities",
        type: "entity",
        array: !0,
        description: "Entities must have assetLoader.js scripts attached.",
      },
    ],
  }),
  (AssetLoadingSystem.prototype.initialize = function () {
    this._groups = [];
    for (let t in this.assetGroups) this._setUpGroup(this.assetGroups[t]);
    (this.app.afterGroupLoaded = this._afterGroupLoaded.bind(this)),
      (this.app.afterGroupsLoaded = this._afterGroupsLoaded.bind(this)),
      (this.app.assetLibrary = {});
    for (let t in this.entity.children) {
      const e = this.entity.children[t];
      e.enabled &&
        (this.app.assetLibrary[e.name] = e.script.assetLoader.assets);
    }
    this.entityGroups.forEach((t) => {
      this.app.on(t.EnableOnEvent, () => {
        t.entityGroup.enabled = !0;
      });
    }, this);
  }),
  (AssetLoadingSystem.prototype._setUpGroup = function (t) {
    this._groups.push({
      loaded: !1,
      name: t.name,
      entities: t.entities,
      numWaiting: t.entities.length,
      forceInstancerUpdate: t.forceInstancerUpdate,
      waitingCallbacks: [],
    });
    for (let e in t.entities)
      t.entities[e].script.assetLoader.entity.once(
        "finish",
        this._onFinish.bind(this, t.name)
      );
  }),
  (AssetLoadingSystem.prototype._onFinish = function (t) {
    for (let e in this._groups) {
      const s = this._groups[e];
      if (s.name == t && (s.numWaiting--, s.numWaiting <= 0)) {
        s.loaded = !0;
        for (let t in s.waitingCallbacks) s.waitingCallbacks[t]();
        s.forceInstancerUpdate && (window.forceInstancerUpdate = !0),
          (s.waitingCallbacks = []);
      }
    }
  }),
  (AssetLoadingSystem.prototype._afterGroupLoaded = function (t, e) {
    for (let s in this._groups) {
      const n = this._groups[s];
      n.name == t && (n.loaded ? e() : n.waitingCallbacks.push(e));
    }
  }),
  (AssetLoadingSystem.prototype._afterGroupsLoaded = function (t, e) {
    let s = 0;
    for (let e in t) {
      const n = t[e];
      for (let t in this._groups) {
        const e = this._groups[t];
        e.name == n && e.loaded && s++;
      }
    }
    if (s != t.length)
      for (let n in t) {
        const a = t[n];
        this._afterGroupLoaded(a, () => {
          s++, s == t.length && e();
        });
      }
    else e();
  });
var Hud = pc.createScript("hud");
Hud.attributes.add("jumpButton", { type: "entity" }),
  Hud.attributes.add("elements", {
    type: "entity",
    array: !0,
    description:
      "All the elements that should be enabled and disabled when the player is in a station",
  }),
  (Hud.prototype.initialize = function () {
    this.app.hud = this;
  }),
  (Hud.prototype.hide = function () {
    this.elements.forEach((t) => {
      t.enabled = !1;
    });
  }),
  (Hud.prototype.show = function () {
    setTimeout(() => {
      this.elements.forEach((t) => {
        t.enabled = !0;
      }),
        this.app.isUsingTouch
          ? (this.jumpButton.enabled = !0)
          : (this.jumpButton.enabled = !1);
    });
  });
var CameraZoom = pc.createScript("cameraZoom");
CameraZoom.attributes.add("zoomInButton", { type: "entity" }),
  CameraZoom.attributes.add("zoomOutButton", { type: "entity" }),
  (CameraZoom.prototype.initialize = function () {
    (this._zoom = { minZ: 2, maxZ: 14, minY: 2.07, maxY: 4.84 }),
      (this.playerPositionOffset =
        this.entity.script.camera.playerPositionOffset),
      (this._isHoldingZoomOut = !1),
      (this._isHoldingZoomIn = !1),
      this.zoomOutButton.button.on(
        "pressedstart",
        () => {
          this._isHoldingZoomOut = !0;
        },
        this
      ),
      this.zoomOutButton.button.on(
        "pressedend",
        () => {
          this._isHoldingZoomOut = !1;
        },
        this
      ),
      this.zoomInButton.button.on(
        "pressedstart",
        () => {
          this._isHoldingZoomIn = !0;
        },
        this
      ),
      this.zoomInButton.button.on(
        "pressedend",
        () => {
          this._isHoldingZoomIn = !1;
        },
        this
      ),
      this.app.mouse &&
        this.app.mouse.on("mousewheel", this._onMouseWheel, this);
  }),
  (CameraZoom.prototype.update = function (o) {
    this.app.globals.movementAllowed &&
      !1 === this.app.globals.scrollZoomBlocked &&
      (this._isHoldingZoomIn
        ? this._zoomIn(o)
        : this._isHoldingZoomOut && this._zoomOut(o));
  }),
  (CameraZoom.prototype._onMouseWheel = function (o) {
    this.app.globals.movementAllowed &&
      !1 === this.app.globals.scrollZoomBlocked &&
      (o.wheel > 0 ? this._zoomIn(0.06) : this._zoomOut(0.06));
  }),
  (CameraZoom.prototype._zoomIn = function (o) {
    (this.playerPositionOffset.y -= 1.38 * o),
      (this.playerPositionOffset.z -= 6 * o),
      this._enforceZoomLimits();
  }),
  (CameraZoom.prototype._zoomOut = function (o) {
    (this.playerPositionOffset.y += 1.38 * o),
      (this.playerPositionOffset.z += 6 * o),
      this._enforceZoomLimits();
  }),
  (CameraZoom.prototype._enforceZoomLimits = function () {
    const o = this._zoom;
    this.playerPositionOffset.z < o.minZ
      ? (this.playerPositionOffset.z = o.minZ)
      : this.playerPositionOffset.z > o.maxZ &&
        (this.playerPositionOffset.z = o.maxZ),
      this.playerPositionOffset.y < o.minY
        ? (this.playerPositionOffset.y = o.minY)
        : this.playerPositionOffset.y > o.maxY &&
          (this.playerPositionOffset.y = o.maxY);
  });
var WaterRipples = pc.createScript("waterRipples");
WaterRipples.attributes.add("rippleTemplate", {
  type: "asset",
  asssetType: "template",
}),
  WaterRipples.attributes.add("rippleScale", {
    type: "curve",
    curves: ["x", "y", "z"],
  }),
  WaterRipples.attributes.add("rippleLocalY", { type: "curve" }),
  WaterRipples.attributes.add("intervalMinS", {
    type: "number",
    default: 0.3,
    description: "Min time between new ripple spawns",
  }),
  WaterRipples.attributes.add("intervalMaxS", {
    type: "number",
    default: 1.2,
    description: "Max time between new ripple spawns",
  }),
  WaterRipples.attributes.add("lifeTimeMinS", {
    type: "number",
    default: 1.8,
    description: "Min time ripple will exist for (smaller is faster)",
  }),
  WaterRipples.attributes.add("lifeTimeMaxS", {
    type: "number",
    default: 5,
    description: "Max time ripple will exist for (smaller is faster)",
  }),
  (WaterRipples.prototype.initialize = function () {
    (this._ripples = []),
      (this._playersInWater = []),
      (this._bounds = this._getBounds()),
      (this._players = []),
      this._updatePlayers(),
      this.app.on("instance:change", this._checkInWaterPlayers, this),
      this.app.on("remote:player:connect", this._updatePlayers, this),
      this.app.on("remote:player:disconnect", this._onRemoteDisconnect, this);
  }),
  (WaterRipples.prototype._getBounds = function () {
    const e = this.entity.getPosition(),
      t = this.entity.collision.linearOffset,
      i = this.entity.collision.halfExtents;
    return {
      xMin: e.x + t.x - i.x,
      xMax: e.x + t.x + i.x,
      zMin: e.z + t.z - i.z,
      zMax: e.z + t.z + i.z,
    };
  }),
  (WaterRipples.prototype._updatePlayers = function () {
    this._players = [
      this.app.globals.localPlayer,
      ...this.app.globals.remotePlayerGroup.children,
    ];
  }),
  (WaterRipples.prototype._onRemoteDisconnect = function (e) {
    this._removeFromWater(e), this._updatePlayers();
  }),
  (WaterRipples.prototype.update = function (e) {
    FrameTracker.num % 20 == 0 &&
      (this._checkForNewPlayers(), this._checkInWaterPlayers()),
      this._deleteOldRipples(e),
      this._updateRipples(e),
      FrameTracker.num % 5 == 0 && this._createNewRipples(e);
  }),
  (WaterRipples.prototype._checkForNewPlayers = function () {
    for (let e in this._players) {
      const t = this._players[e];
      if (t.hasLeftGame) continue;
      const i = t.getPosition(),
        s = t.collision;
      if (s) {
        if (
          ((i.y += s.linearOffset.y - s.halfExtents.y),
          i.y > this.entity.getPosition().y)
        )
          continue;
        const e = this._bounds;
        if (i.x > e.xMin && i.x < e.xMax && i.z > e.zMin && i.z < e.zMax) {
          const e = this._addToPlayersInside(t);
          e && this._createRipple(e);
        }
      }
    }
  }),
  (WaterRipples.prototype._checkInWaterPlayers = function () {
    let e = this._playersInWater;
    for (let t in e) {
      let i = e[t].player;
      const s = i.getPosition(),
        p = i.collision;
      if (p) {
        if (
          ((s.y += p.linearOffset.y - p.halfExtents.y),
          s.y > this.entity.getPosition().y)
        ) {
          this._removeFromWater(i);
          continue;
        }
        const e = this._bounds;
        if (s.x < e.xMin || s.x > e.xMax || s.z < e.zMin || s.z > e.zMax) {
          this._removeFromWater(i);
          continue;
        }
      }
    }
  }),
  (WaterRipples.prototype._addToPlayersInside = function (e) {
    let t = this._playersInWater;
    for (let i in t) if (t[i].player.getGuid() == e.getGuid()) return null;
    const i = { player: e, nextRippleCountdownS: 0, lastInputPercentage: 0 };
    return this._playersInWater.push(i), i;
  }),
  (WaterRipples.prototype._removeFromWater = function (e) {
    let t = this._playersInWater;
    for (let i in t) {
      if (t[i].player.getGuid() == e.getGuid())
        return void this._playersInWater.splice(i, 1);
    }
  }),
  (WaterRipples.prototype._deleteOldRipples = function (e) {
    let t = this._ripples;
    for (let i in t) {
      let s = t[i];
      (s.lifeLeftS -= e),
        s.lifeLeftS <= 0 &&
          (this.app.root.removeChild(s),
          this._ripples.splice(i, 1),
          s.destroy());
    }
  }),
  (WaterRipples.prototype._updateRipples = function (e) {
    let t = this.entity.getPosition(),
      i = this.rippleScale,
      s = this._ripples;
    const p = this.rippleLocalY;
    for (let e in s) {
      let r = s[e];
      const l = 1 - r.lifeLeftS / r.lifeTimeS,
        a = i.value(l);
      r.setLocalScale(a[0], a[1], a[2]);
      let n = r.getPosition();
      (n.y = t.y + p.value(l)), r.setPosition(n);
    }
  }),
  (WaterRipples.prototype._createNewRipples = function (e) {
    let t = this._playersInWater;
    for (let i in t) {
      let s = t[i];
      if (s.player && s.player.script) {
        let t = 0;
        (t = s.player.isRemote
          ? s.player.script.remotePlayer.inputPercentage
          : s.player.script.localPlayerMovement.getInputPercentage()),
          t - s.lastInputPercentage >= 0.4
            ? (s.nextRippleCountdownS = 0)
            : (s.nextRippleCountdownS -= 5 * e),
          (s.lastInputPercentage = t),
          s.nextRippleCountdownS <= 0 && this._createRipple(s);
      }
    }
  }),
  (WaterRipples.prototype._createRipple = function (e) {
    const t = e.player,
      i = t.getPosition(),
      s = this._bounds;
    if (i.x < s.xMin || i.x > s.xMax || i.z < s.zMin || i.z > s.zMax) return;
    let p, r;
    if (e.player.isRemote) {
      (p = { x: 0, z: 0 }), (r = e.player.script.remotePlayer.inputPercentage);
    } else {
      const e = t.script.localPlayerMovement;
      (p = e.getCurrentVelocity()), (r = e.getInputPercentage());
    }
    let l = this.rippleTemplate.resource.instantiate();
    l.setPosition(
      i.x + p.x * r * 5,
      this.entity.getPosition().y,
      i.z + p.z * r * 5
    ),
      l.setEulerAngles(0, pc.math.random(0, 360), 0),
      l.setLocalScale(0.3, 0, 0.3),
      this.app.root.addChild(l),
      window.setVDynamic(l, !0),
      (e.nextRippleCountdownS =
        this.intervalMaxS - r * (this.intervalMaxS - this.intervalMinS)),
      (l.lifeLeftS =
        this.lifeTimeMaxS - r * (this.lifeTimeMaxS - this.lifeTimeMinS)),
      (l.lifeTimeS = l.lifeLeftS),
      this._ripples.push(l);
  });
var Instancer = pc.createScript("instancer");
Instancer.attributes.add("excludeLayers", {
  type: "string",
  array: !0,
  default: ["Depth", "Skybox", "Immediate", "UI"],
  title: "Exclude Layers",
  description: "Mesh instances rendered in these layers won't be instanced.",
}),
  Instancer.attributes.add("excludeTag", {
    type: "string",
    default: "instancer-disable",
    title: "Exclude Tag",
    description:
      "An entity tag that can be used to exclude objects from instancing.",
  }),
  Instancer.attributes.add("excludeCullingTag", {
    type: "string",
    default: "instancer-culling-disable",
    title: "Exclude Culling Tag",
    description:
      "An entity tag that can be used to exclude objects from frustum culling.",
  }),
  Instancer.attributes.add("excludeCellsTag", {
    type: "string",
    default: "instancer-cells-disable",
    title: "Exclude Cells Tag",
    description:
      "An entity tag that can be used to exclude objects from cells.",
  }),
  Instancer.attributes.add("frustumCulling", {
    type: "boolean",
    default: !1,
    title: "Frustum Culling",
  }),
  Instancer.attributes.add("cullingFrequency", {
    type: "number",
    default: 300,
    title: "Culling Frequency",
    description:
      "Set the minimum frequency in ms between each culling update. Set to 0.0 to run per frame.",
  }),
  Instancer.attributes.add("lodLevels", {
    type: "json",
    title: "Lod Levels",
    array: !0,
    schema: [
      {
        name: "index",
        type: "number",
        default: 0,
        precision: 0,
        min: 0,
        max: 9,
        description:
          "The LOD index for this level e.g. 0 for LOD0, 1 for LOD 1 etc",
      },
      { name: "start", type: "number", default: 0 },
      { name: "end", type: "number", default: 0 },
    ],
  }),
  Instancer.attributes.add("cells", {
    type: "json",
    title: "Cells",
    schema: [
      { name: "enabled", type: "boolean", default: !1, title: "Enabled" },
      {
        name: "size",
        type: "vec3",
        default: [10, 10, 10],
        title: "Size",
        description: "The size of our cell.",
      },
    ],
  });
var InstancerLOD = pc.createScript("instancerLOD");
InstancerLOD.attributes.add("lodLevels", {
  type: "json",
  title: "Lod Levels",
  array: !0,
  schema: [
    {
      name: "index",
      type: "number",
      default: 0,
      precision: 0,
      min: 0,
      max: 9,
      description:
        "The LOD index for this level e.g. 0 for LOD0, 1 for LOD 1 etc",
    },
    { name: "start", type: "number", default: 0 },
    { name: "end", type: "number", default: 0 },
  ],
}),
  (Instancer.prototype.initialize = function () {
    (Instancer.api = this),
      (this.payloads = {}),
      (this.cellsList = {}),
      (window.forceInstancerUpdate = !1),
      (this._startCullingFrequency = this.cullingFrequency),
      this.prepare(),
      this.app.on("update", this.onUpdate, this);
  }),
  (Instancer.prototype.prepare = function () {
    this.overrideEngine(), this.parseLayers();
  }),
  (Instancer.prototype.parseLayers = function () {
    const e = this.app.scene.layers.layerList;
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      if (!1 === this.isLayerValid(n)) continue;
      const s = n.meshInstances.filter(
        (e) => e.material.blendType === pc.BLEND_NONE
      );
      n.removeMeshInstances(s), n.addMeshInstances(s);
    }
  }),
  (Instancer.prototype.onUpdate = function () {
    if (window.forceInstancerUpdate) {
      this.cullingFrequency = 0;
      let e = this.payloads;
      for (let t in e) e[t].cullingFrequencyTime = 0;
    }
    if (this.frustumCulling) {
      const e = this.cellsList;
      for (let t in e) {
        const n = e[t];
        for (let e in n.isCameraVisible) n.isCameraVisible[e] = void 0;
      }
    } else {
      const e = this.payloads;
      for (let t in e) this.updatePayload(e[t]);
    }
    window.forceInstancerUpdate &&
      ((this.cullingFrequency = this._startCullingFrequency),
      (window.forceInstancerUpdate = !1));
  }),
  (Instancer.prototype.addMeshInstance = function (e, t, n, s) {
    if (!e.material || e.mesh.skin) return !1;
    if ("instancer-payload" === e.node.name) return !1;
    const a = e.node;
    return (
      !!a &&
      !0 !== a.tags.has(this.excludeTag) &&
      !(a.render && a.render.batchGroupId > -1) &&
      (s || this.addToPayload(a, e, t, !1),
      !n && e.castShadow && this.addToPayload(a, e, t, !0),
      !0)
    );
  }),
  (Instancer.prototype.removeMeshInstance = function (e, t, n, s) {
    if (!e.material || e.mesh.skin) return !1;
    if ("instancer-payload" === e.node.name) return !1;
    let a;
    return (
      s || (a = this.removeFromPayload(e, t, !1)),
      n || (a = this.removeFromPayload(e, t, !0)),
      a
    );
  }),
  (Instancer.prototype.addToPayload = function (e, t, n, s) {
    const a = this.getPayloadId(t, n, s);
    let i,
      r,
      o,
      c = this.payloads[a];
    if (
      (c || (c = this.createPayload(a, t, n, s)), e.name.indexOf("_LOD") > -1)
    ) {
      const t = e.name.split("_LOD");
      (i = parseInt(t[1])), (r = e.script?.instancerLOD?.lodLevels);
    }
    this.cells.enabled &&
      !1 === e.tags.has(this.excludeCellsTag) &&
      (o = this.getCell(e.getPosition(), this.cells.size));
    const l = {
      cell: o,
      entity: e,
      lodIndex: i,
      lodLevels: r,
      excludeFromCulling: e.tags.has(this.excludeCullingTag),
      meshInstance: t,
    };
    c.refMeshInstances.push(t),
      s ? (l.mainInstance = t.mainInstance) : (t.mainInstance = l),
      c.instances.push(l),
      this.updateVertexBuffer(c, !0),
      this.frustumCulling || this.updatePayload(c);
  }),
  (Instancer.prototype.getCell = function (e, t) {
    const n = Math.max(t.x, 1),
      s = Math.max(t.y, 1),
      a = Math.max(t.z, 1),
      i = Math.floor(e.x / n) * n,
      r = Math.floor(e.y / s) * s,
      o = Math.floor(e.z / a) * a,
      c = i.toFixed(0) + "_" + r.toFixed(0) + "_" + o.toFixed(0);
    let l = this.cellsList[c];
    if (!l) {
      const e = new pc.Vec3(i, r, o),
        n = new pc.Vec3();
      (n.x = t.x / 2),
        (n.y = t.y / 2),
        (n.z = t.z / 2),
        (l = {
          aabb: new pc.BoundingBox(e, n),
          center: e,
          cullingRadius: n.length(),
          isCameraVisible: {},
        }),
        (this.cellsList[c] = l);
    }
    return l;
  }),
  (Instancer.prototype.removeFromPayload = function (e, t, n) {
    const s = this.getPayloadId(e, t, n);
    let a = this.payloads[s];
    if (!a) return !1;
    if (a.refMeshInstances.length > 0) {
      const t = a.refMeshInstances.indexOf(e);
      if (-1 === t) return !1;
      a.instances.splice(t, 1), a.refMeshInstances.splice(t, 1);
    }
    0 === a.instances.length
      ? (this.clearPayload(a), delete this.payloads[s])
      : (this.updateVertexBuffer(a, !0),
        this.frustumCulling || this.updatePayload(a));
  }),
  (Instancer.prototype.clearPayload = function (e) {
    e.buffer.vertexBuffer.destroy(),
      e.layer.removeMeshInstances([e.meshInstance], !0);
  }),
  (Instancer.prototype.updatePayload = function (e, t) {
    let n = !1;
    if (e.isDynamic) {
      const t = e.instances;
      for (let e in t)
        if (t[e].entity.vDynamic) {
          n = !0;
          break;
        }
    }
    if (!1 === n && t && this.cullingFrequency > 0) {
      const t = pc.now();
      if (t - e.cullingFrequencyTime < this.cullingFrequency) return;
      e.cullingFrequencyTime = t;
    }
    let s = 0;
    const a = e.instances;
    for (let n = 0; n < a.length; n++) {
      const i = a[n];
      s = this.updateInstance(i, e, s, t);
    }
    const i = s / 16;
    this.updateVertexBuffer(e, !1, i);
  }),
  (Instancer.prototype.updateInstance = function (e, t, n, s) {
    if (s) {
      if (!1 === e.excludeFromCulling) {
        if (!this.cullInstance(e, s)) return n;
      }
      if (void 0 !== e.lodIndex && this.lodLevels.length > 0) {
        if (!this.isLodVisible(e, s)) return n;
      }
    }
    const a = t.buffer.originalStorage,
      i = e.entity.getWorldTransform().data;
    for (let e = 0; e < 16; e++) a[n++] = i[e];
    return n;
  }),
  (Instancer.prototype.cullInstance = function (e, t) {
    if (e.cell) return this.isCellVisible(e.cell, t);
    {
      const n = e.meshInstance;
      let s = n._isVisible(t);
      return (n.visibleThisFrame = s), s > 0;
    }
  }),
  (Instancer.tempSphere = new pc.BoundingSphere()),
  (Instancer.prototype.isCellVisible = function (e, t) {
    const n = t.node._guid;
    if (void 0 !== e.isCameraVisible[n]) return e.isCameraVisible[n];
    {
      const s = Instancer.tempSphere;
      (s.center = e.center), (s.radius = e.cullingRadius);
      const a = t.frustum.containsSphere(s);
      return (e.isCameraVisible[n] = a), a;
    }
  }),
  (Instancer.prototype.isLodVisible = function (e, t) {
    if (e.mainInstance) return e.mainInstance.isLodVisible;
    const n = e.lodLevels
        ? e.lodLevels[e.lodIndex]
        : this.lodLevels[e.lodIndex],
      s = t.node.getPosition().distance(e.entity.getPosition()),
      a = n.start;
    let i = n.end > 0 ? n.end : 1 / 0;
    i > t.farClip && (i = t.farClip);
    const r = s >= a && s < i;
    return e.mainInstance || (e.isLodVisible = r), r;
  }),
  (Instancer.prototype.updateVertexBuffer = function (e, t, n) {
    const s = e.buffer,
      a = e.meshInstance;
    let i;
    if (
      ((i = void 0 !== n ? n : e.instances.length), i > 0 || !s.vertexBuffer)
    ) {
      let n;
      if (
        ((n =
          t || !s.originalStorage
            ? (s.originalStorage = new Float32Array(16 * i))
            : s.originalStorage.subarray(0, 16 * i)),
        i > s.instancesCount || !s.vertexBuffer)
      ) {
        s.vertexBuffer && s.vertexBuffer.destroy();
        const e = pc.VertexFormat.defaultInstancingFormat
            ? pc.VertexFormat.defaultInstancingFormat
            : pc.VertexFormat.getDefaultInstancingFormat(
                this.app.graphicsDevice
              ),
          t = new pc.VertexBuffer(this.app.graphicsDevice, e, i, {
            data: n,
            usage: pc.BUFFER_STATIC,
          });
        a.setInstancing(t, !0), (s.vertexBuffer = t);
      } else {
        const t = s.vertexBuffer,
          a = t.format;
        (t.numBytes = a.verticesByteSize ? a.verticesByteSize : a.size * i),
          t.setData(n),
          (e.meshInstance.instancingCount = i);
      }
    }
    (s.instancesCount = i), (a.instancingCount = i);
  }),
  (Instancer.prototype.createPayload = function (e, t, n, s) {
    const a = this.getPayloadMaterial(t.material),
      i = new pc.MeshInstance(t.mesh, a, new pc.GraphNode("instancer-payload"));
    (i.castShadow = s),
      i.aabb.center.copy(t.aabb.center),
      i.aabb.halfExtents.copy(t.aabb.halfExtents),
      s ? n.addShadowCasters([i]) : n.addMeshInstances([i]);
    const r = {
      buffer: {
        instancesCount: 0,
        originalStorage: void 0,
        vertexBuffer: void 0,
      },
      cullingFrequencyTime: void 0,
      isDynamic: t.node.tags.has("dynamic"),
      id: e,
      instances: [],
      layer: n,
      meshInstance: i,
      refMeshInstances: [],
      shadowCaster: s,
    };
    return (
      this.setPayloadCulling(this.frustumCulling, r), (this.payloads[e] = r), r
    );
  }),
  (Instancer.prototype.setPayloadCulling = function (e, t) {
    (t.meshInstance.cull = e),
      e &&
        (t.meshInstance.isVisibleFunc = (e) =>
          this.isMeshInstanceVisible(e, t));
  }),
  (Instancer.prototype.isMeshInstanceVisible = function (e, t) {
    return this.updatePayload(t, e), !0;
  }),
  (Instancer.prototype.getPayloadMaterial = function (e) {
    return (
      (e.onUpdateShader = function (e) {
        return (e.litOptions.useInstancing = !0), e;
      }),
      e.update(),
      e
    );
  }),
  (Instancer.prototype.getPayloadId = function (e, t, n) {
    const s = t.id,
      a = e.mesh.id,
      i = e.material.id,
      r = n ? 1 : 0;
    let o = 0;
    return (
      e && e.node && e.node.tags.has("dynamic") && (o = 1),
      `${s}_${a}_${i}_${r}_${o}`
    );
  }),
  (Instancer.prototype.isLayerValid = function (e) {
    return -1 === this.excludeLayers.indexOf(e.name);
  }),
  (Instancer.prototype.overrideEngine = function () {
    const e = pc.Layer.prototype.addMeshInstances;
    pc.Layer.prototype.addMeshInstances = function (t, n) {
      if (!0 === Instancer.api.isLayerValid(this)) {
        let s = [];
        for (const e of t) {
          Instancer.api.addMeshInstance(e, (layer = this), n, !1) || s.push(e);
        }
        (arguments[0] = s), e.apply(this, arguments);
      } else e.apply(this, arguments);
    };
    const t = pc.Layer.prototype.removeMeshInstances;
    pc.Layer.prototype.removeMeshInstances = function (e, n) {
      if (!0 === Instancer.api.isLayerValid(this)) {
        let s = [];
        for (const t of e) {
          Instancer.api.removeMeshInstance(t, (layer = this), n, !1) ||
            s.push(t);
        }
        (arguments[0] = s), t.apply(this, arguments);
      } else t.apply(this, arguments);
    };
    const n = pc.Layer.prototype.addShadowCasters;
    pc.Layer.prototype.addShadowCasters = function (e) {
      if (!0 === Instancer.api.isLayerValid(this)) {
        let t = [];
        for (const n of e) {
          Instancer.api.addMeshInstance(n, (layer = this), !1, !0) || t.push(n);
        }
        (arguments[0] = t), n.apply(this, arguments);
      } else n.apply(this, arguments);
    };
    const s = pc.Layer.prototype.removeShadowCasters;
    pc.Layer.prototype.removeShadowCasters = function (e) {
      if (!0 === Instancer.api.isLayerValid(this)) {
        let t = [];
        for (const n of e) {
          Instancer.api.removeMeshInstance(n, (layer = this), !1, !0) ||
            t.push(n);
        }
        (arguments[0] = t), s.apply(this, arguments);
      } else s.apply(this, arguments);
    };
  });
"undefined" != typeof document &&
  /*! FPSMeter 0.3.1 - 9th May 2013 | https://github.com/Darsain/fpsmeter */
  ((function (t, e) {
    function s(t, e) {
      for (var n in e)
        try {
          t.style[n] = e[n];
        } catch (t) {}
      return t;
    }
    function H(t) {
      return null == t
        ? String(t)
        : "object" == typeof t || "function" == typeof t
        ? Object.prototype.toString
            .call(t)
            .match(/\s([a-z]+)/i)[1]
            .toLowerCase() || "object"
        : typeof t;
    }
    function R(t, e) {
      if ("array" !== H(e)) return -1;
      if (e.indexOf) return e.indexOf(t);
      for (var n = 0, o = e.length; n < o; n++) if (e[n] === t) return n;
      return -1;
    }
    function I() {
      var t,
        e = arguments;
      for (t in e[1])
        if (e[1].hasOwnProperty(t))
          switch (H(e[1][t])) {
            case "object":
              e[0][t] = I({}, e[0][t], e[1][t]);
              break;
            case "array":
              e[0][t] = e[1][t].slice(0);
              break;
            default:
              e[0][t] = e[1][t];
          }
      return 2 < e.length
        ? I.apply(null, [e[0]].concat(Array.prototype.slice.call(e, 2)))
        : e[0];
    }
    function N(t) {
      return 1 === (t = Math.round(255 * t).toString(16)).length ? "0" + t : t;
    }
    function S(t, e, n, o) {
      t.addEventListener
        ? t[o ? "removeEventListener" : "addEventListener"](e, n, !1)
        : t.attachEvent && t[o ? "detachEvent" : "attachEvent"]("on" + e, n);
    }
    function D(t, e) {
      function g(t, e, n, o) {
        return h[0 | t][Math.round(Math.min(((e - n) / (o - n)) * C, C))];
      }
      function r() {
        O.legend.fps !== j &&
          ((O.legend.fps = j), (O.legend[c] = j ? "FPS" : "ms")),
          (b = j ? y.fps : y.duration),
          (O.count[c] = 999 < b ? "999+" : b.toFixed(99 < b ? 0 : F.decimals));
      }
      function m() {
        for (
          p = n(),
            A < p - F.threshold &&
              ((y.fps -= y.fps / Math.max(1, (60 * F.smoothing) / F.interval)),
              (y.duration = 1e3 / y.fps)),
            w = F.history;
          w--;

        )
          (_[w] = 0 === w ? y.fps : _[w - 1]),
            (T[w] = 0 === w ? y.duration : T[w - 1]);
        if ((r(), F.heat)) {
          if (z.length)
            for (w = z.length; w--; )
              z[w].el.style[o[z[w].name].heatOn] = j
                ? g(o[z[w].name].heatmap, y.fps, 0, F.maxFps)
                : g(o[z[w].name].heatmap, y.duration, F.threshold, 0);
          if (O.graph && o.column.heatOn)
            for (w = M.length; w--; )
              M[w].style[o.column.heatOn] = j
                ? g(o.column.heatmap, _[w], 0, F.maxFps)
                : g(o.column.heatmap, T[w], F.threshold, 0);
        }
        if (O.graph)
          for (v = 0; v < F.history; v++)
            M[v].style.height =
              (j
                ? _[v]
                  ? Math.round((x / F.maxFps) * Math.min(_[v], F.maxFps))
                  : 0
                : T[v]
                ? Math.round((x / F.threshold) * Math.min(T[v], F.threshold))
                : 0) + "px";
      }
      function k() {
        20 > F.interval
          ? ((l = i(k)), m())
          : ((l = setTimeout(k, F.interval)), (f = i(m)));
      }
      function G(t) {
        (t = t || window.event).preventDefault
          ? (t.preventDefault(), t.stopPropagation())
          : ((t.returnValue = !1), (t.cancelBubble = !0)),
          y.toggle();
      }
      function U() {
        F.toggleOn && S(O.container, F.toggleOn, G, 1),
          t.removeChild(O.container);
      }
      function V() {
        if (
          (O.container && U(),
          (o = D.theme[F.theme]),
          !(h = o.compiledHeatmaps || []).length && o.heatmaps.length)
        ) {
          for (v = 0; v < o.heatmaps.length; v++)
            for (h[v] = [], w = 0; w <= C; w++) {
              var e,
                n = h[v],
                a = w;
              e = (0.33 / C) * w;
              var i = o.heatmaps[v].saturation,
                p = o.heatmaps[v].lightness,
                l = void 0,
                c = void 0,
                u = void 0,
                d = (u = void 0),
                f = (l = c = void 0);
              f = void 0;
              0 === (u = 0.5 >= p ? p * (1 + i) : p + i - p * i)
                ? (e = "#000")
                : ((c = (u - (d = 2 * p - u)) / u),
                  (f = (e *= 6) - (l = Math.floor(e))),
                  (f *= u * c),
                  0 === l || 6 === l
                    ? ((l = u), (c = d + f), (u = d))
                    : 1 === l
                    ? ((l = u - f), (c = u), (u = d))
                    : 2 === l
                    ? ((l = d), (c = u), (u = d + f))
                    : 3 === l
                    ? ((l = d), (c = u - f))
                    : 4 === l
                    ? ((l = d + f), (c = d))
                    : ((l = u), (c = d), (u -= f)),
                  (e = "#" + N(l) + N(c) + N(u))),
                (n[a] = e);
            }
          o.compiledHeatmaps = h;
        }
        for (var b in ((O.container = s(
          document.createElement("div"),
          o.container
        )),
        (O.count = O.container.appendChild(
          s(document.createElement("div"), o.count)
        )),
        (O.legend = O.container.appendChild(
          s(document.createElement("div"), o.legend)
        )),
        (O.graph = F.graph
          ? O.container.appendChild(s(document.createElement("div"), o.graph))
          : 0),
        (z.length = 0),
        O))
          O[b] && o[b].heatOn && z.push({ name: b, el: O[b] });
        if (((M.length = 0), O.graph))
          for (
            O.graph.style.width =
              F.history * o.column.width +
              (F.history - 1) * o.column.spacing +
              "px",
              w = 0;
            w < F.history;
            w++
          )
            (M[w] = O.graph.appendChild(
              s(document.createElement("div"), o.column)
            )),
              (M[w].style.position = "absolute"),
              (M[w].style.bottom = 0),
              (M[w].style.right =
                w * o.column.width + w * o.column.spacing + "px"),
              (M[w].style.width = o.column.width + "px"),
              (M[w].style.height = "0px");
        s(O.container, F),
          r(),
          t.appendChild(O.container),
          O.graph && (x = O.graph.clientHeight),
          F.toggleOn &&
            ("click" === F.toggleOn && (O.container.style.cursor = "pointer"),
            S(O.container, F.toggleOn, G));
      }
      "object" === H(t) &&
        undefined === t.nodeType &&
        ((e = t), (t = document.body)),
        t || (t = document.body);
      var o,
        h,
        p,
        l,
        f,
        x,
        b,
        w,
        v,
        y = this,
        F = I({}, D.defaults, e || {}),
        O = {},
        M = [],
        C = 100,
        z = [],
        P = F.threshold,
        E = 0,
        A = n() - P,
        _ = [],
        T = [],
        j = "fps" === F.show;
      (y.options = F),
        (y.fps = 0),
        (y.duration = 0),
        (y.isPaused = 0),
        (y.tickStart = function () {
          E = n();
        }),
        (y.tick = function () {
          (p = n()),
            (P += (p - A - P) / F.smoothing),
            (y.fps = 1e3 / P),
            (y.duration = E < A ? P : p - E),
            (A = p);
        }),
        (y.pause = function () {
          return (
            l && ((y.isPaused = 1), clearTimeout(l), a(l), a(f), (l = f = 0)), y
          );
        }),
        (y.resume = function () {
          return l || ((y.isPaused = 0), k()), y;
        }),
        (y.set = function (t, e) {
          return (
            (F[t] = e),
            (j = "fps" === F.show),
            -1 !== R(t, u) && V(),
            -1 !== R(t, d) && s(O.container, F),
            y
          );
        }),
        (y.showDuration = function () {
          return y.set("show", "ms"), y;
        }),
        (y.showFps = function () {
          return y.set("show", "fps"), y;
        }),
        (y.toggle = function () {
          return y.set("show", j ? "ms" : "fps"), y;
        }),
        (y.hide = function () {
          return y.pause(), (O.container.style.display = "none"), y;
        }),
        (y.show = function () {
          return y.resume(), (O.container.style.display = "block"), y;
        }),
        (y.destroy = function () {
          y.pause(), U(), (y.tick = y.tickStart = function () {});
        }),
        V(),
        k();
    }
    var n,
      o = t.performance;
    n =
      o && (o.now || o.webkitNow)
        ? o[o.now ? "now" : "webkitNow"].bind(o)
        : function () {
            return +new Date();
          };
    for (
      var a = t.cancelAnimationFrame || t.cancelRequestAnimationFrame,
        i = t.requestAnimationFrame,
        h = 0,
        p = 0,
        l = (o = ["moz", "webkit", "o"]).length;
      p < l && !a;
      ++p
    )
      i =
        (a =
          t[o[p] + "CancelAnimationFrame"] ||
          t[o[p] + "CancelRequestAnimationFrame"]) &&
        t[o[p] + "RequestAnimationFrame"];
    a ||
      ((i = function (e) {
        var o = n(),
          a = Math.max(0, 16 - (o - h));
        return (
          (h = o + a),
          t.setTimeout(function () {
            e(o + a);
          }, a)
        );
      }),
      (a = function (t) {
        clearTimeout(t);
      }));
    var c =
      "string" === H(document.createElement("div").textContent)
        ? "textContent"
        : "innerText";
    (D.extend = I),
      (window.FPSMeter = D),
      (D.defaults = {
        interval: 100,
        smoothing: 10,
        show: "fps",
        toggleOn: "click",
        decimals: 1,
        maxFps: 60,
        threshold: 100,
        position: "absolute",
        zIndex: 10,
        left: "5px",
        top: "5px",
        right: "auto",
        bottom: "auto",
        margin: "0 0 0 0",
        theme: "dark",
        heat: 0,
        graph: 0,
        history: 20,
      });
    var u = ["toggleOn", "theme", "heat", "graph", "history"],
      d = "position zIndex left top right bottom margin".split(" ");
  })(window),
  (function (t, e) {
    e.theme = {};
    var n = (e.theme.base = {
      heatmaps: [],
      container: {
        heatOn: null,
        heatmap: null,
        padding: "5px",
        minWidth: "95px",
        height: "30px",
        lineHeight: "30px",
        textAlign: "right",
        textShadow: "none",
      },
      count: {
        heatOn: null,
        heatmap: null,
        position: "absolute",
        top: 0,
        right: 0,
        padding: "5px 10px",
        height: "30px",
        fontSize: "24px",
        fontFamily: "Consolas, Andale Mono, monospace",
        zIndex: 2,
      },
      legend: {
        heatOn: null,
        heatmap: null,
        position: "absolute",
        top: 0,
        left: 0,
        padding: "5px 10px",
        height: "30px",
        fontSize: "12px",
        lineHeight: "32px",
        fontFamily: "sans-serif",
        textAlign: "left",
        zIndex: 2,
      },
      graph: {
        heatOn: null,
        heatmap: null,
        position: "relative",
        boxSizing: "padding-box",
        MozBoxSizing: "padding-box",
        height: "100%",
        zIndex: 1,
      },
      column: { width: 4, spacing: 1, heatOn: null, heatmap: null },
    });
    (e.theme.dark = e.extend({}, n, {
      heatmaps: [{ saturation: 0.8, lightness: 0.8 }],
      container: {
        background: "#222",
        color: "#fff",
        border: "1px solid #1a1a1a",
        textShadow: "1px 1px 0 #222",
      },
      count: { heatOn: "color" },
      column: { background: "#3f3f3f" },
    })),
      (e.theme.light = e.extend({}, n, {
        heatmaps: [{ saturation: 0.5, lightness: 0.5 }],
        container: {
          color: "#666",
          background: "#fff",
          textShadow:
            "1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        },
        count: { heatOn: "color" },
        column: { background: "#eaeaea" },
      })),
      (e.theme.colorful = e.extend({}, n, {
        heatmaps: [{ saturation: 0.5, lightness: 0.6 }],
        container: {
          heatOn: "backgroundColor",
          background: "#888",
          color: "#fff",
          textShadow: "1px 1px 0 rgba(0,0,0,.2)",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        },
        column: { background: "#777", backgroundColor: "rgba(0,0,0,.2)" },
      })),
      (e.theme.transparent = e.extend({}, n, {
        heatmaps: [{ saturation: 0.8, lightness: 0.5 }],
        container: {
          padding: 0,
          color: "#fff",
          textShadow: "1px 1px 0 rgba(0,0,0,.5)",
        },
        count: { padding: "0 5px", height: "40px", lineHeight: "40px" },
        legend: { padding: "0 5px", height: "40px", lineHeight: "42px" },
        graph: { height: "40px" },
        column: {
          width: 5,
          background: "#999",
          heatOn: "backgroundColor",
          opacity: 0.5,
        },
      }));
  })(window, FPSMeter));
var FPSCounter = pc.createScript("fPSCounter");
(FPSCounter.prototype.initialize = function () {
  window.location.href.indexOf("launch.playcanvas.com") > -1 ||
  window.location.href.indexOf("playcanv.as") > -1
    ? (this.fpsMeter = new FPSMeter({
        heat: !0,
        graph: !0,
        left: "5px",
        top: "5px",
        right: "auto",
        bottom: "auto",
      }))
    : (this.fpsMeter = new FPSMeter({
        heat: !0,
        graph: !0,
        left: "5px",
        top: "5px",
        right: "auto",
        bottom: "auto",
        zIndex: -1e3,
      })),
    (this._avgFps = 0),
    (this._samples = []),
    (this.app.getCurrentFps = () => this.fpsMeter.fps),
    (this.app.getAvgFps = () => this._avgFps);
}),
  (FPSCounter.prototype.update = function (t) {
    if (
      (this.fpsMeter.tick(),
      FrameTracker.num % 3 == 0 &&
        (this._samples.push(this.fpsMeter.fps), this._samples.length > 30))
    ) {
      this._samples.shift();
      let t = this._samples,
        e = 0;
      for (let n in t) e += t[n];
      this._avgFps = e / t.length;
    }
  });
var Butterfly = pc.createScript("butterfly");
Butterfly.attributes.add("leftWing", { type: "entity" }),
  Butterfly.attributes.add("rightWing", { type: "entity" }),
  Butterfly.attributes.add("wingRotation", { type: "curve" }),
  Butterfly.attributes.add("flapTimeS", { type: "number", default: 1 }),
  Butterfly.attributes.add("movementTimeS", { type: "number", default: 10 }),
  Butterfly.attributes.add("movementCurve", {
    type: "curve",
    curves: ["x", "y", "z"],
  }),
  (Butterfly.prototype.initialize = function () {
    window.setVDynamic(this.entity, !0),
      (this._flapCountdownS = pc.math.random(0, this.flapTimeS)),
      (this._movementCountdownS = pc.math.random(0, this.movementTimeS)),
      (this._startPosition = this.entity.getPosition().clone()),
      (this._currentPosition = this._startPosition.clone());
  }),
  (Butterfly.prototype.update = function (t) {
    (this._flapCountdownS -= t),
      (this._movementCountdownS -= t),
      this._flapCountdownS <= 0 && (this._flapCountdownS = this.flapTimeS),
      this._movementCountdownS <= 0 &&
        (this._movementCountdownS = this.movementTimeS);
    const e = this._flapCountdownS / this.flapTimeS;
    this.leftWing.setLocalEulerAngles(0, this.wingRotation.value(e), 0),
      this.rightWing.setLocalEulerAngles(0, -this.wingRotation.value(e), 0);
    const i = this._movementCountdownS / this.movementTimeS,
      n = this.movementCurve.value(i);
    this._currentPosition.set(n[0], n[1], n[2]),
      this._currentPosition.add(this._startPosition),
      this.entity.setPosition(this._currentPosition);
  });
var EmojiSystem = pc.createScript("emojiSystem");
EmojiSystem.attributes.add("emojiPanel", { type: "entity" }),
  EmojiSystem.attributes.add("emojiContent", { type: "entity" }),
  EmojiSystem.attributes.add("emojiTemplate", {
    type: "asset",
    assetType: "template",
  }),
  EmojiSystem.attributes.add("closeButton", { type: "entity" }),
  EmojiSystem.attributes.add("emoteDB", { type: "entity" }),
  EmojiSystem.attributes.add("emoteTemplate", {
    type: "asset",
    assetType: "template",
  }),
  EmojiSystem.attributes.add("emoteContent", { type: "entity" }),
  EmojiSystem.attributes.add("poseButtonGroup", { type: "entity" }),
  EmojiSystem.attributes.add("flagContent", { type: "entity" }),
  EmojiSystem.attributes.add("chatScript", { type: "entity" }),
  EmojiSystem.attributes.add("chatbox", { type: "entity" }),
  EmojiSystem.attributes.add("flagOrder", {
    type: "asset",
    assetType: "sprite",
    array: !0,
  }),
  (EmojiSystem.prototype.initialize = function () {
    (this.app.emojiSystem = this),
      (this.emojiSprites = this.app.assets.findByTag("emojiSprite")),
      (this.flagSprites = this.app.assets.findByTag("flagSprite")),
      this.createEmoteButtons(),
      this.createEmojiButtons(),
      this.createFlagButtons(),
      this.entity.button.on(
        "click",
        function () {
          this.showEmojiPanel(),
            "portrait" == this.app.globals.layout &&
              (this.chatbox.script.chatbox.closeClick(),
              (this.chatScript.script.chat.hudChatBtn.enabled = !0));
        },
        this
      ),
      this.closeButton.button.on("click", this.hideEmojiPanel, this),
      this.app.on("runway:player:walk", this.hideEmojiPanel, this);
  }),
  (EmojiSystem.prototype.showEmojiPanel = function () {
    (this.emojiPanel.enabled = !0), (this.app.globals.scrollZoomBlocked = !0);
  }),
  (EmojiSystem.prototype.hideEmojiPanel = function () {
    (this.emojiPanel.enabled = !1), (this.app.globals.scrollZoomBlocked = !1);
  }),
  (EmojiSystem.prototype.createEmojiButtons = function () {
    let t = this.emojiSprites,
      e = this.emojiContent;
    for (let i in t) {
      const s = this.emojiTemplate.resource.instantiate();
      (s.name = t[i].name), (s.element.spriteAsset = t[i]), e.addChild(s);
    }
  }),
  (EmojiSystem.prototype.createFlagButtons = function () {
    let t = this.flagSprites,
      e = this.flagContent;
    for (let i in t) {
      const s = this.emojiTemplate.resource.instantiate();
      (s.name = t[i].name),
        (s.element.spriteAsset = t[i]),
        s.tags.remove("emojiButton"),
        s.tags.add("flagButton"),
        (s.spriteId = t[i].id),
        e.addChild(s);
    }
    let i = 0;
    for (let t in this.flagOrder)
      for (let s in e.children) {
        let o = e.children[s];
        o.spriteId === this.flagOrder[t].id &&
          (o.reparent(o.parent, i), (i += 1));
      }
  }),
  (EmojiSystem.prototype.createEmoteButtons = function () {
    let t = this.emoteDB.children,
      e = this.emoteContent,
      i = this.poseButtonGroup;
    for (let s in t) {
      const o = this.emoteTemplate.resource.instantiate();
      (o.name = t[s].name),
        (o.element.spriteAsset = t[s].script.emoteItem.uiSprite),
        (o.script.emoteButton.emoteNum = t[s].script.emoteItem.emoteNum),
        t[s].script.emoteItem.isPremium &&
          ((o.findByName("adIcon").enabled = !0),
          (o.script.emoteButton.isPremium = !0)),
        e.addChild(o);
      const a = this.emoteTemplate.resource.instantiate();
      (a.name = t[s].name + "_Pose"),
        (a.element.spriteAsset = t[s].script.emoteItem.uiSprite),
        (a.script.emoteButton.emoteNum = t[s].script.emoteItem.emoteNum),
        a.tags.remove("emoteButton"),
        a.tags.add("poseBtn"),
        i.addChild(a);
    }
  });
var SpawnSystem = pc.createScript("spawnSystem");
SpawnSystem.attributes.add("spawnAreas", {
  type: "json",
  array: !0,
  schema: [
    { name: "instanceName", type: "string" },
    { name: "collisionEntities", type: "entity", array: !0 },
  ],
}),
  (SpawnSystem.prototype.initialize = function () {
    (this.app.spawnSystem = this), (this._spawnPosition = new pc.Vec3());
  }),
  (SpawnSystem.prototype.getSpawnPosition = function (t = "lobby") {
    const n = this._getRandomArea(t),
      a = n.getPosition(),
      s = n.collision.halfExtents,
      e = a.x - s.x,
      i = a.x + s.x,
      o = a.z - s.z,
      p = a.z + s.z;
    return (
      this._spawnPosition.set(pc.math.random(e, i), a.y, pc.math.random(o, p)),
      this._spawnPosition
    );
  }),
  (SpawnSystem.prototype._getRandomArea = function (t) {
    const n = this.spawnAreas.find(
      (n) => n.instanceName == t
    ).collisionEntities;
    return n[Math.floor(Math.random() * n.length)];
  });
var EmojiButton = pc.createScript("emojiButton");
(EmojiButton.prototype.initialize = function () {
  this.entity.button.on("click", this.showEmoji, this);
}),
  (EmojiButton.prototype.postInitialize = function () {
    (this._emojiSlot = this.app.globals.localPlayer.findByName("emojiSlot")),
      (this._emojiSlot.element.drawOrder = 100);
  }),
  (EmojiButton.prototype.showEmoji = function () {
    this.app.afterGroupLoaded(
      "emojis",
      () => {
        let t = this.entity,
          e = this._emojiSlot;
        (e.element.spriteAsset = t.element.spriteAsset),
          e.script.pulse.start(),
          e.script.fade.fadeIn(),
          e.script.fade.fadeOut();
        const i = t.name;
        this.app.fire("watcher:track", "emoji_" + i);
        const o = i.split(" ")[1],
          s = [
            this.app.networkCodes.COMMUNICATION,
            [
              [
                [1, 0],
                [1, parseInt(o)],
              ],
            ],
          ];
        this.app.server.send(MessagePack.encode(s));
      },
      this
    );
  });
var PointAtcamera = pc.createScript("pointAtcamera");
(PointAtcamera.prototype.initialize = function () {}),
  (PointAtcamera.prototype.update = function (t) {
    this.entity.setRotation(this.app.globals.camera.getRotation());
  });
var NameGenerator = pc.createScript("nameGenerator");
NameGenerator.attributes.add("menuNameText", { type: "entity" }),
  NameGenerator.attributes.add("refreshNameButton", { type: "entity" }),
  NameGenerator.attributes.add("localPlayerName", { type: "entity" }),
  (NameGenerator.prototype.initialize = function () {
    (this._words = [
      "Cat",
      "Kitten",
      "Dog",
      "Dragon",
      "Unicorn",
      "Bunny",
      "Puppy",
      "Kitty",
      "Panda",
      "Teddy",
      "Firefly",
      "Hen",
      "Otter",
      "Puffin",
      "Penguin",
      "Butterfly",
      "Ladybug",
      "Bee",
      "Dove",
      "Swan",
      "Meow",
      "Woof",
      "Cutie",
      "Fuzzy",
      "Wild",
      "Baby",
      "Hero",
      "Girly",
      "Ghost",
      "Princess",
      "Rainbow",
      "Mermaid",
      "Magic",
      "Angel",
      "Treasure",
      "Dinosaur",
      "Pixie",
      "Fairy",
      "Sweet",
      "Sparkle",
      "Glitter",
      "Shimmer",
      "Giggle",
      "Puff",
      "Pompom",
      "Pop",
      "Charm",
      "Dream",
      "Luck",
      "Style",
      "Fashion",
      "Song",
      "Dance",
      "Candy",
      "Bubblegum",
      "Cookie",
      "Peanut",
      "Butter",
      "Mochi",
      "Noodle",
      "Cookie",
      "Jellybean",
      "Waffle",
      "Cupcake",
      "Lollipop",
      "Pancake",
      "Muffin",
      "Cupcake",
      "Milkshake",
      "Marshmallow",
      "Pumpkin",
      "Cinnamon",
      "Caramel",
      "Peach",
      "Cherry",
      "Apple",
      "Strawberry",
      "Jelly",
      "Bean",
      "Cake",
      "Pie",
      "Pudding",
      "Fruit",
      "Berry",
      "Sugar",
      "Spice",
      "Star",
      "Snowflake",
      "Galaxy",
      "Bubble",
      "Sunshine",
      "Blossom",
      "Petal",
      "Moon",
      "Sun",
      "Cloud",
      "Snow",
      "Wind",
      "Storm",
      "Flower",
      "Leaf",
      "Tree",
      "Fern",
      "Poppy",
      "Lily",
      "Rose",
      "Daisy",
      "Tulip",
      "Space",
      "Jungle",
      "Desert",
      "Sand",
      "Ocean",
      "Dust",
      "Fire",
      "Water",
      "Night",
      "Ruby",
      "Emerald",
      "Diamond",
      "Jewel",
      "Gem",
      "Crystal",
      "Pearl",
      "Violet",
      "Red",
      "Green",
      "Pink",
      "Purple",
      "Orange",
      "Yellow",
      "Gold",
      "Silver",
      "Blue",
    ]),
      this.refreshNameButton.button.on(
        "click",
        function () {
          this.setNewName(), this.refreshNameButton.script.pulse.start();
        },
        this
      ),
      this.app.on("setExistingName", this.setExistingName, this),
      this.app.on("setNewName", this.setNewName, this);
  }),
  (NameGenerator.prototype._generate = function () {
    const e = Math.floor(Math.random() * this._words.length),
      t = Math.floor(Math.random() * this._words.length);
    let a = this._words[e] + this._words[t];
    return "RainbowStyle" == a ? this._generate() : a;
  }),
  (NameGenerator.prototype.setNewName = function () {
    let e = this._generate();
    (this.app.globals.playerName = e),
      (this.localPlayerName.element.text = e),
      (this.menuNameText.element.text = e),
      (this.app.globals.playerNameWasChanged = !0),
      this.app.saveStats("playerName", this.app.globals.playerName);
  }),
  (NameGenerator.prototype.setExistingName = function () {
    let e = this.app.globals.playerName;
    (this.localPlayerName.element.text = e),
      (this.menuNameText.element.text = e);
  });
var EmoteItem = pc.createScript("emoteItem");
EmoteItem.attributes.add("emoteNum", {
  type: "number",
  description: "This number corresponds to the number in the animStateGraph.",
}),
  EmoteItem.attributes.add("uiSprite", { type: "asset", assetType: "sprite" }),
  EmoteItem.attributes.add("isPremium", { type: "boolean", default: !1 }),
  EmoteItem.attributes.add("music", {
    type: "asset",
    assetType: "audio",
    description: "(Optional) Music track to sync with emote",
  }),
  EmoteItem.attributes.add("customFace", {
    type: "boolean",
    default: !1,
    description: "Checks if there are any meshes to swap",
  });
var EmoteButton = pc.createScript("emoteButton");
EmoteButton.attributes.add("emoteNum", { type: "number" }),
  EmoteButton.attributes.add("isPremium", { type: "boolean", default: !1 }),
  (EmoteButton.prototype.initialize = function () {
    this.entity.button.on(
      "click",
      function () {
        this.entity.script.emoteButton.isPremium
          ? this.premiumEmoteClicked()
          : (this.swapEmote(), this.app.fire("sound:pop:pitch1"));
      },
      this
    );
  }),
  (EmoteButton.prototype.premiumEmoteClicked = function () {
    let t = !0;
    "competition" == this.app.instance.name &&
      (t = !!this.app.competition.isAdWatchable()),
      t &&
        (this.app.fire(
          "watcher:track",
          "start_rewarded_emote",
          this.entity.name
        ),
        this.app.fire(
          "poki:rewardedBreak:play",
          function () {
            (this.entity.script.emoteButton.isPremium = !1),
              (this.entity.findByName("adIcon").enabled = !1),
              this.app.fire(
                "watcher:track",
                "finish_rewarded_emote_" + this.entity.name
              ),
              this.app.globals.unlockedEmotes.push(this.entity.name),
              this.app.saveStats(
                "unlockedEmotes",
                this.app.globals.unlockedEmotes
              ),
              this.swapEmote(),
              this.app.fire("sound:pop:pitch1.5");
          }.bind(this),
          function () {}.bind(this)
        ));
  }),
  (EmoteButton.prototype.swapEmote = function () {
    this.app.afterGroupLoaded(
      "vortinaPoses",
      () => {
        this.entity.parent.children.forEach(function (t) {
          t.element.color = this.app.uiColors.inactive;
        }, this),
          (this.entity.element.color = this.app.uiColors.indigo);
        let t = this.app.globals.localCharAnims;
        t.isFollowingPlayer() && t.clearFollowPlayer(),
          t.setPose(this.emoteNum);
        const e = [
          this.app.networkCodes.COMMUNICATION,
          [
            [
              [1, 2],
              [1, this.emoteNum],
            ],
          ],
        ];
        this.app.server.send(MessagePack.encode(e));
      },
      this
    );
  });
var EffectsSystem = pc.createScript("effectsSystem");
EffectsSystem.attributes.add("uiScreen", { type: "entity" }),
  EffectsSystem.attributes.add("uiEffectTemplate", {
    type: "asset",
    assetType: "template",
    description:
      "The entity with the element component to be used for all UI-based effects",
  }),
  EffectsSystem.attributes.add("worldEffectTemplate", {
    type: "asset",
    assetType: "template",
    description:
      "The entity with the sprite component to be used for all world-based effects",
  }),
  EffectsSystem.attributes.add("scaleCurve", {
    type: "curve",
    default: { keys: [0, 0.8, 0.25, 1.8, 1, 2.8], type: pc.CURVE_SPLINE },
  }),
  EffectsSystem.attributes.add("opacityCurve", {
    type: "curve",
    default: { keys: [0, 0, 0.1, 1, 0.9, 1, 1, 0], type: pc.CURVE_SMOOTHSTEP },
  }),
  EffectsSystem.attributes.add("yDriftCurve", {
    type: "curve",
    default: { keys: [0, 0, 0.33, 3, 1, 5], type: pc.CURVE_SPLINE },
  }),
  EffectsSystem.attributes.add("effects", {
    type: "json",
    array: !0,
    schema: [
      { name: "name", type: "string", description: "The name of the effect" },
      {
        name: "animationSprite",
        type: "asset",
        assetType: "sprite",
        description: "The sprite animation to play for this effect",
      },
      {
        name: "durationS",
        type: "number",
        default: 1,
        description: "The default duration this effect will be visible for",
      },
    ],
  }),
  (EffectsSystem.prototype.initialize = function () {
    (this.app.effects = this),
      (this._defaultScale = 3),
      (this._uiEffects = []),
      (this._worldEffects = []);
  }),
  (EffectsSystem.prototype.addWorldEffect = function (t, e, s) {
    const i = this.effects.find((e) => e.name === t);
    let a = this.worldEffectTemplate.resource.instantiate();
    a.sprite.addClip({
      fps: 16,
      loop: !1,
      name: t,
      spriteAsset: i.animationSprite,
    }),
      a.sprite.play(t),
      this.app.root.addChild(a),
      (a.durationS = i.durationS),
      this._addEffect(a, e, this._worldEffects, s);
  }),
  (EffectsSystem.prototype.addUiEffect = function (t, e, s) {
    const i = this.effects.find((e) => e.name === t);
    if (s.attachTo && s.attachTo.element) {
      const t = s.attachTo.element.screenCorners,
        i = t[0].x + (t[2].x - t[0].x) / 2,
        a = t[0].y + (t[2].y - t[0].y),
        n = this.app.graphicsDevice.width,
        o = this.app.graphicsDevice.height;
      (e.x = (i / n) * 2 - 1), (e.y = (a / o) * 2 - 1);
    }
    let a = this.uiEffectTemplate.resource.instantiate();
    (a.element.spriteAsset = i.animationSprite),
      this.uiScreen.addChild(a),
      (a.durationS = i.durationS),
      this._addEffect(a, e, this._uiEffects, s);
  }),
  (EffectsSystem.prototype._addEffect = function (t, e, s, i) {
    t.enabled = !0;
    const a = e.y;
    t.setPosition(e.x, e.y, e.z),
      s.push({
        entity: t,
        startY: a,
        durationS: t.durationS,
        countdownS: t.durationS,
        params: i,
      });
  }),
  (EffectsSystem.prototype.update = function (t) {
    const e = this.app.globals.camera.getRotation();
    for (let s = this._worldEffects.length - 1; s >= 0; s--) {
      let i = this._worldEffects[s];
      i.countdownS -= t;
      const a = 1 - i.countdownS / i.durationS;
      this._setOpacityAndScale(i, i.entity.sprite, a), i.entity.setRotation(e);
      let n = i.entity.getPosition();
      (n.y = i.startY + this.yDriftCurve.value(a)),
        i.entity.setPosition(n),
        i.countdownS <= 0 &&
          (this._worldEffects.splice(s, 1),
          this.app.root.removeChild(i.entity),
          i.entity.destroy());
    }
    for (let e = this._uiEffects.length - 1; e >= 0; e--) {
      let s = this._uiEffects[e];
      s.countdownS -= t;
      const i = 1 - s.countdownS / s.durationS;
      this._setOpacityAndScale(s, s.entity.element, i),
        s.countdownS <= 0 &&
          (this._uiEffects.splice(e, 1),
          this.uiScreen.removeChild(s.entity),
          s.entity.destroy());
    }
  }),
  (EffectsSystem.prototype._setOpacityAndScale = function (t, e, s) {
    e.opacity = this.opacityCurve.value(s);
    let i = this.scaleCurve.value(s);
    (i *= this._defaultScale),
      t.params && t.params.scale && (i *= t.params.scale),
      t.entity.setLocalScale(i, i, i);
  });
var ToggleButton = pc.createScript("toggleButton");
ToggleButton.attributes.add("entitiesToEnable", { type: "entity", array: !0 }),
  ToggleButton.attributes.add("entitiesToDisable", {
    type: "entity",
    array: !0,
  }),
  ToggleButton.attributes.add("entitiesInToggleGroup", {
    type: "entity",
    array: !0,
  }),
  (ToggleButton.prototype.initialize = function () {
    this.entity.button.on("click", this.toggleEntities, this);
  }),
  (ToggleButton.prototype.toggleEntities = function () {
    this.entitiesInToggleGroup.forEach(function (t) {
      t.element.opacity = 0;
    }),
      this.entitiesToEnable.forEach(function (t) {
        t.enabled = !0;
      }),
      this.entitiesToDisable.forEach(function (t) {
        t.enabled = !1;
      }),
      (this.entity.element.opacity = 1);
  });
var OpenNewTabButton = pc.createScript("openNewTabButton");
OpenNewTabButton.attributes.add("url", {
  type: "string",
  default: "https://privacy.v1digital.com",
}),
  (OpenNewTabButton.prototype.initialize = function () {
    this.entity.element.on(
      "click",
      function (t) {
        t.stopPropagation(), window.open(this.url, "_blank");
      },
      this
    );
  });
var Teleporter = pc.createScript("teleporter");
Teleporter.attributes.add("exitPosition", {
  type: "vec3",
  description:
    "World position where player will be teleported to after they enter the teleporter",
}),
  Teleporter.attributes.add("preTeleportPositionOffset", {
    type: "vec3",
    default: [0, 0, 0],
    description:
      "(Optional) If player uses a teleporterReturn, this offset will be applied to the preTeleportPosition to avoid dropping exiting player into the original teleporter again. Eg, Return them a few units back from the doorway they originally teleported through.",
  }),
  Teleporter.attributes.add("playSound", { type: "boolean", default: !1 }),
  Teleporter.attributes.add("trackingEvent", { type: "string", default: "" }),
  (Teleporter.prototype.initialize = function () {
    this._preTeleportPos = new pc.Vec3();
  }),
  (Teleporter.prototype.teleport = function (e) {
    this._preTeleportPos.copy(e.getPosition()),
      this._preTeleportPos.add(this.preTeleportPositionOffset),
      (e.preTeleportPosition = this._preTeleportPos),
      e.setPosition(this.exitPosition),
      (window.forceInstancerUpdate = !0),
      this.app.camera.snap(),
      this.playSound && this.app.fire("teleportSound"),
      this.trackingEvent &&
        this.trackingEvent.length > 0 &&
        this.app.fire("watcher:track", this.trackingEvent);
  });
var PlayerArea = pc.createScript("playerArea");
PlayerArea.attributes.add("playerMesh", { type: "entity" }),
  (PlayerArea.prototype.initialize = function () {
    (this.currentArea = ""), (this.enteredAt = 0);
  }),
  (PlayerArea.prototype.postInitialize = function () {
    this.app.on("station:exit", this._onStationExit, this),
      this.app.on("station:enter", this._onStationEnter, this);
  }),
  (PlayerArea.prototype._isStackableArea = function (t) {
    if (t.includes(":wait:")) return !1;
    return null !== this.app.stationSystem.getStationByName(t);
  }),
  (PlayerArea.prototype._onStationExit = function () {
    this.entity.isLocalPlayer && this._transmitPlayerArea("");
  }),
  (PlayerArea.prototype._onStationEnter = function (t) {
    this.entity.isLocalPlayer && this._transmitPlayerArea(t);
  }),
  (PlayerArea.prototype._transmitPlayerArea = function (t) {
    this.app.server.send(
      MessagePack.encode([this.app.networkCodes.PLAYER_AREA, [[[3, t]]]])
    );
  }),
  (PlayerArea.prototype.applyUpdate = function (t) {
    if (this.entity.isLocalPlayer) return;
    const e = t[2];
    let r = this.currentArea;
    (this.currentArea = e),
      e != r && this.app.fire("remote:player:area:update"),
      "" == e
        ? (this.entity.script.remotePlayer.show(), (this.enteredAt = 0))
        : (this.entity.script.remotePlayer.show(),
          (this.enteredAt = pc.now()),
          (r = e)),
      r &&
        r.length > 0 &&
        this._isStackableArea(r) &&
        this._onlyShowMostRecentPlayerInArea(r);
  }),
  (PlayerArea.prototype._onlyShowMostRecentPlayerInArea = function (t) {
    if ("" == t) return;
    let e = this.app.globals.remotePlayerGroup.children,
      r = null,
      a = 0;
    for (let i = 0; i < e.length; i++) {
      let n = e[i],
        o = n.script.playerArea;
      o.currentArea == t &&
        (n.script.remotePlayer.hide(),
        (null == r || o.enteredAt > a) && ((r = n), (a = o.enteredAt)));
    }
    r && r.script.remotePlayer.show();
  });
var RenderQuality = pc.createScript("renderQuality");
RenderQuality.attributes.add("updateIntervalS", { type: "number", default: 1 }),
  (RenderQuality.prototype.initialize = function () {
    (this.app.renderQuality = 3), (this._countdownS = this.updateIntervalS);
  }),
  (RenderQuality.prototype.update = function (t) {
    (this._countdownS -= t), this._countdownS <= 0 && this._updateQuality();
  }),
  (RenderQuality.prototype._updateQuality = function () {
    const t = this.app.getAvgFps();
    t >= 50
      ? this._setQuality(3)
      : t >= 29
      ? this._setQuality(2)
      : this._setQuality(1);
  }),
  (RenderQuality.prototype._setQuality = function (t) {
    this.app.renderQuality != t &&
      ((this.app.renderQuality = t), this.app.fire("render:quality:update", t));
  });
var GameTimers = pc.createScript("gameTimers");
GameTimers.attributes.add("labelBg", { type: "entity" }),
  GameTimers.attributes.add("timerLabel", {
    type: "entity",
    description: "UI label for the event the timer is counting down to",
  }),
  GameTimers.attributes.add("timerUiElement", {
    type: "entity",
    description: "The timer value in seconds eg 22.5s",
  }),
  GameTimers.attributes.add("subLabelBg", { type: "entity" }),
  (GameTimers.prototype.initialize = function () {
    (this.app.timers = this),
      (this.countdownMs = 0),
      (this._rollingDiff = 0),
      this.app.on("instance:change", this._hide, this),
      this.app.on("competition:wait:exit", this._hide, this);
  }),
  (GameTimers.prototype._hide = function () {
    (this.countdownMs = 0),
      (this.timerLabel.element.text = ""),
      (this.timerUiElement.element.text = ""),
      (this.timerLabel.enabled = !1),
      (this.timerUiElement.enabled = !1),
      (this.labelBg.enabled = !1),
      (this.subLabelBg.enabled = !1);
  }),
  (GameTimers.prototype.update = function (e) {
    if (this.countdownMs > 0) {
      const t = 0.1 * this._rollingDiff;
      (this._rollingDiff -= t),
        (this.countdownMs += t),
        (this.countdownMs -= 1e3 * e),
        (this.timerUiElement.element.text = this.formatTime(this.countdownMs)),
        this.countdownMs < 6e4 && (this.timerUiElement.element.text += "s");
    }
  }),
  (GameTimers.prototype.formatTime = function (e) {
    return e <= 0 ? "0.0" : window.formatTimeS(e / 1e3);
  }),
  (GameTimers.prototype.applyUpdate = function (e) {
    const t = e[1],
      i = e[2],
      n = this.countdownMs;
    (this.countdownMs = i[0][1]),
      (this._rollingDiff = this.countdownMs - n),
      (this._rollingDiff > 200 || this._rollingDiff < -200) &&
        (this._rollingDiff = 0),
      t.includes("competition:wait")
        ? ((this.timerLabel.element.text = this.app.i18n.getText(
            "Next game in",
            this.app.i18n.locale
          )),
          (this.labelBg.enabled = !0),
          (this.timerUiElement.enabled = !0),
          (this.timerLabel.enabled = !0),
          (this.subLabelBg.enabled = !0))
        : ((this.labelBg.enabled = !1),
          (this.subLabelBg.enabled = !1),
          (this.timerLabel.enabled = !1),
          (this.timerUiElement.enabled = !1));
  });
var Instance = pc.createScript("instance");
(Instance.prototype.initialize = function () {
  (this.app.instance = this),
    (this.id = ""),
    (this.joinedAt = 0),
    (this.name = "lobby");
}),
  (Instance.prototype.applyUpdate = function (e) {
    this._changeInstance(e[1], e[2]);
  }),
  (Instance.prototype._changeInstance = function (e, t) {
    (this.id = e),
      this.name != t &&
        ((this.name = t),
        (this.joinedAt = pc.now()),
        this.app.fire("instance:change", this),
        "lobby" == this.name
          ? (console.log(
              "instance changed back to lobby, keeping player where they are"
            ),
            (this.app.camera.player = this.app.globals.localPlayer),
            console.log(
              "camera now looking at local player " +
                this.app.camera.player.getGuid()
            ),
            this.app.competition.exit(),
            this.setPlayerPositionOverride(!1),
            this.app.globals.localCharAnims.setAnimIdle(!0),
            this.app.hasEvent("server:disconnected") &&
              this.app.off("server:disconnected", this._onDisconnect, this))
          : "competition" == this.name &&
            (this.app.competition.enter(),
            this.app.hasEvent("server:disconnected") &&
              this.app.off("server:disconnected", this._onDisconnect, this),
            this.app.once("server:disconnected", this._onDisconnect, this)));
  }),
  (Instance.prototype.setPlayerPositionOverride = function (e) {
    this.app.globals.localPlayer.positionOverrideActive = e;
    let t = this.app.remotePlayers;
    for (const n in t)
      t.hasOwnProperty(n) &&
        (this.app.remotePlayers[n].positionOverrideActive = e);
  }),
  (Instance.prototype._onDisconnect = function () {
    console.log("Error: Server disconnected, changing instance back to lobby!"),
      this._changeInstance("lobby", "lobby");
  });
var CompetitionWaitingArea = pc.createScript("competitionWaitingArea");
CompetitionWaitingArea.attributes.add("name", { type: "string" }),
  (CompetitionWaitingArea.prototype.initialize = function () {
    (this.isLocalPlayerInside = !1),
      (this.boundingBox = this.entity.script.boundingBox);
  }),
  (CompetitionWaitingArea.prototype.update = function (i) {
    if (this.isLocalPlayerInside && FrameTracker.num % 4 == 0) {
      const i = this.app.globals.localPlayer.getPosition();
      this.boundingBox.contains(i) ||
        ((this.isLocalPlayerInside = !1),
        this._transmitPlayerArea(""),
        this.app.fire(this.name + ":exit", this.name));
    }
  }),
  (CompetitionWaitingArea.prototype.enter = function (i) {
    !1 === this.isLocalPlayerInside &&
      i.isLocalPlayer &&
      ((this.isLocalPlayerInside = !0),
      this._transmitPlayerArea(this.name),
      this.app.fire(this.name + ":enter", this.name));
  }),
  (CompetitionWaitingArea.prototype._transmitPlayerArea = function (i) {
    this.app.server.send(
      MessagePack.encode([this.app.networkCodes.PLAYER_AREA, [[[3, i]]]])
    );
  });
var Competition = pc.createScript("competition");
Competition.attributes.add("runway", {
  type: "json",
  schema: [
    { type: "entity", name: "startPos" },
    { type: "entity", name: "endPos" },
    { type: "entity", name: "outOfViewPos" },
  ],
}),
  Competition.attributes.add("podium", {
    type: "json",
    schema: [
      { type: "entity", name: "first" },
      { type: "entity", name: "second" },
      { type: "entity", name: "third" },
    ],
  }),
  Competition.attributes.add("highScoresRowTemplate", {
    type: "asset",
    assetType: "template",
  }),
  Competition.attributes.add("highScoresContainer", { type: "entity" }),
  (Competition.prototype.initialize = function () {
    (this.countdownMs = 0),
      (this.durationMs = 0),
      (this._WALK_DURATION_PERCENTAGE = 0.4),
      (this.phase = ""),
      (this.finalVotes = []),
      (this._englishThemeName = ""),
      (this._localizedThemeName = ""),
      (this.hud = this.entity.script.competitionHud),
      (this.cameras = this.entity.script.competitionCameras),
      (this._walkingPos = new pc.Vec3()),
      (this._walkingPlayer = null),
      (this._prevWalkingPlayer = null),
      (this.themeTranslations = {}),
      (this.app.competition = this);
  }),
  (Competition.prototype.isAdWatchable = function () {
    return "dressing" == this.phase && this.countdownMs >= 6e4;
  }),
  (Competition.prototype.update = function (t) {
    "competition" == this.app.instance.name &&
      (this._updateTimer(t),
      "showtime" == this.phase && this._walkPlayerDownRunway(t),
      this.hud.updateDisplay(this.phase));
  }),
  (Competition.prototype._updateTimer = function (t) {
    this.countdownMs > 0 &&
      ((this.countdownMs -= 1e3 * t),
      (this.hud.timerValue = this.app.timers.formatTime(this.countdownMs)),
      this.countdownMs < 6e4 && (this.hud.timerValue += "s"));
  }),
  (Competition.prototype._walkPlayerDownRunway = function (t) {
    let e = this._walkingPlayer;
    if (!e || e.hasLeftGame || !e.script) return;
    let i = 1 - this.countdownMs / this.durationMs;
    (i = Math.min(1, i / this._WALK_DURATION_PERCENTAGE)),
      this._walkingPos.lerp(
        this.runway.startPos.getPosition(),
        this.runway.endPos.getPosition(),
        i
      ),
      e.setPosition(this._walkingPos),
      e.setEulerAngles(0, 0, 0);
    let s = e.script.charAnims;
    i < 1
      ? this.cameras.runwayCameraTrackWalk(i)
      : (s.isOverrideEnabled() && (s.disableOverride(), s.setAnimIdle()),
        this.cameras.runwayCameraViewFrontOn());
  }),
  (Competition.prototype.enter = function () {
    this.hud.enter(),
      (this.finalVotes = []),
      this.hud.fadeToBlack(1),
      setTimeout(() => {
        this.app.globals.localPlayer.setPosition(
          this.app.spawnSystem.getSpawnPosition("competitionRoom")
        ),
          this.app.camera.snap(),
          (this.app.tracking.numCompetitionsEntered += 1),
          this.app.fire(
            "watcher:track",
            "num_competitions_entered_" +
              this.app.tracking.numCompetitionsEntered
          );
      }, 500);
  }),
  (Competition.prototype.exit = function () {
    this.hud.fadeToBlack(1),
      setTimeout(() => {
        if (
          ((this.phase = ""),
          (this._localizedThemeName = ""),
          this.hud.exit(),
          this.cameras.exit(),
          this._setPlayerVisibility("show"),
          (this.app.globals.movementAllowed = !0),
          this.app.screenSystem.closeActiveScreen(),
          this.app.globals.localCharAnims.disableOverride(),
          !1 === this._isLocalPlayerOnPodium())
        ) {
          const t = this.app.spawnSystem.getSpawnPosition("competitionLobby");
          this.app.globals.localPlayer.setPosition(t);
        } else
          (this.app.inputState.angleDeg = 270),
            this.app.globals.localPlayer.setEulerAngles(0, 0, 0);
        this.app.camera.snap(),
          this.app.instance.setPlayerPositionOverride(!1),
          !1 === this.app.tracking.finishedCompetition &&
            ((this.app.tracking.finishedCompetition = !0),
            this.app.fire("watcher:track", "first_competition_finished")),
          (this.app.tracking.numCompetitionsPlayed += 1),
          this.app.fire(
            "watcher:track",
            "num_competitions_played_" + this.app.tracking.numCompetitionsPlayed
          );
      }, 500);
  }),
  (Competition.prototype._isLocalPlayerOnPodium = function () {
    if (this.finalVotes.length > 0)
      for (let t = 0; t < 3; t++)
        if (
          (console.log("checking final vote position: " + t),
          this.finalVotes[t].clientId == this.app.server.clientId)
        )
          return !0;
    return !1;
  }),
  (Competition.prototype.applyUpdate = function (t) {
    this._localizedThemeName.length <= 0 &&
      ((this._englishThemeName = t[4]),
      (this._localizedThemeName =
        this.themeTranslations[this._englishThemeName] ||
        this._englishThemeName),
      (this.hud.theme = this._localizedThemeName)),
      this._setPhase(t[1]),
      (this.countdownMs = t[2]),
      (this.durationMs = t[3]),
      "showtime" == this.phase && this._setWalkingClient(t[5]),
      t[6] && Object.keys(t[6]).length > 0 && this._setFinalVotes(t[6]),
      this.hud.updateDisplay(this.phase);
  }),
  (Competition.prototype._setPhase = function (t) {
    let e = this._getPhaseName(t);
    if (e == this.phase) return;
    let i = 0,
      s = !1;
    (("showtime" == e && "dressing" == this.phase) ||
      ("awards" == e && "showtime" == this.phase)) &&
      ((i = 500), (s = !0)),
      s && this.hud.fadeToBlack(1),
      (this.phase = e),
      this.app.fire("competition:phase:start", this.phase),
      setTimeout(() => {
        this.cameras.setPhase(this.phase),
          (this.app.globals.movementAllowed = !1),
          (window.forceInstancerUpdate = !0),
          this.app.screenSystem.closeActiveScreen(),
          console.log("new phase set: " + this.phase),
          "showtime" == this.phase
            ? (this.app.instance.setPlayerPositionOverride(!0),
              !1 === this.app.tracking.enteredCompetitionRunway &&
                ((this.app.tracking.enteredCompetitionRunway = !0),
                this.app.fire(
                  "watcher:track",
                  "first_competition_runway_entered"
                )))
            : "awards" == this.phase
            ? (this.app.instance.setPlayerPositionOverride(!0),
              this.cameras.awardsCameraStartMovement(this.durationMs / 1e3),
              (this._walkingPlayer = null),
              this._setPlayerVisibility("hide"),
              this._populateHighScores(this.finalVotes),
              this._putPlayersOnPodium(),
              this._awardStars(),
              !1 === this.app.tracking.enteredCompetitionAwards &&
                ((this.app.tracking.enteredCompetitionAwards = !0),
                this.app.fire(
                  "watcher:track",
                  "first_competition_awards_entered"
                )))
            : "dressing" == this.phase &&
              (this.app.instance.setPlayerPositionOverride(!1),
              (this.app.globals.movementAllowed = !0),
              !1 === this.app.tracking.enteredCompetitionDressing &&
                ((this.app.tracking.enteredCompetitionDressing = !0),
                this.app.fire(
                  "watcher:track",
                  "first_competition_dressing_entered"
                )),
              this.app.fire(
                "watcher:track",
                "competition_theme_" + this.hud.theme
              ));
      }, i);
  }),
  (Competition.prototype._getPhaseName = function (t) {
    switch (t) {
      case 0:
        return "dressing";
      case 1:
        return "showtime";
      case 2:
        return "awards";
    }
    return "";
  }),
  (Competition.prototype._setWalkingClient = function (t) {
    this.hud.walkingClientId != t &&
      (null !== this._walkingPlayer &&
        (this._prevWalkingPlayer = this._walkingPlayer),
      console.log("client is has just started walking: " + t),
      this.hud.fadeToBlack(1),
      (this.hud.walkingClientId = t),
      this.cameras.runwayCameraViewFrontOn(),
      this.app.screenSystem.closeActiveScreen(),
      (this._walkingPlayer = null),
      setTimeout(() => {
        if (
          (this._setPlayerVisibility("hide"),
          this._prevWalkingPlayer &&
            (this._prevWalkingPlayer.hasEvent("disconnect") &&
              this._prevWalkingPlayer.off(
                "disconnect",
                this._walkingPlayerLeft,
                this
              ),
            this._prevWalkingPlayer.setPosition(
              this.runway.outOfViewPos.getPosition()
            )),
          t == this.app.server.clientId)
        )
          (this._walkingPlayer = this.app.globals.localPlayer),
            this._walkingPlayer.script.localPlayer.show();
        else {
          const e = this.app.remotePlayers[t];
          if (!e) return;
          (this._walkingPlayer = e),
            this._walkingPlayer.script.remotePlayer.show();
        }
        let e = this._walkingPlayer.script.charAnims;
        e.playRunwayAnimations(),
          e.enableOverride(),
          this._walkingPlayer.setPosition(this.runway.startPos.getPosition()),
          this.cameras.runwayCameraLookAtPlayer(this._walkingPlayer),
          this.app.fire("runway:player:walk", this._walkingPlayer),
          this._walkingPlayer.once("disconnect", this._walkingPlayerLeft, this);
      }, 500));
  }),
  (Competition.prototype._setPlayerVisibility = function (t) {
    this.app.globals.localPlayer.script.localPlayer[t]();
    let e = this.app.remotePlayers;
    for (const i in e)
      if (e.hasOwnProperty(i)) {
        this.app.remotePlayers[i].script.remotePlayer[t]();
      }
  }),
  (Competition.prototype._setFinalVotes = function (t) {
    0 == this.finalVotes.length &&
      ((this.finalVotes = Object.entries(t)
        .sort((t, e) => {
          const i = e[1] - t[1];
          return 0 !== i ? i : Number(t[0]) - Number(e[0]);
        })
        .map(([t, e]) => ({ clientId: Number(t), numVotes: e }))),
      console.log("Setting final votes", t));
  }),
  (Competition.prototype._awardStars = function () {
    for (let t in this.finalVotes) {
      const { clientId: e, numVotes: i } = this.finalVotes[t];
      if (e == this.app.server.clientId)
        return void this.app.fire("stars:earn", i);
    }
  }),
  (Competition.prototype._putPlayersOnPodium = function () {
    this._showPlayerAt(this.finalVotes[0], this.podium.first.getPosition()),
      this._showPlayerAt(this.finalVotes[1], this.podium.second.getPosition()),
      this._showPlayerAt(this.finalVotes[2], this.podium.third.getPosition());
  }),
  (Competition.prototype._showPlayerAt = function (t, e) {
    if (void 0 === t) return;
    let i = null;
    if (t.clientId == this.app.server.clientId)
      (i = this.app.globals.localPlayer), i.script.localPlayer.show();
    else {
      if (((i = this.app.remotePlayers[t.clientId]), !i)) return;
      i.script.remotePlayer.show();
    }
    i.setPosition(e),
      i.setEulerAngles(0, 0, 0),
      i.script.charAnims.setAnimWave(!0);
  }),
  (Competition.prototype._populateHighScores = function (t) {
    let e = this.highScoresContainer.children;
    for (let t = e.length - 1; t >= 0; t--)
      e[t].destroy(), this.highScoresContainer.removeChild(e[t]);
    let i = 1;
    for (let e in t) {
      const s = this._getPlayerName(t[e].clientId);
      if (s.length > 0) {
        let a = this.highScoresRowTemplate.resource.instantiate();
        a.setLocalPosition(0, 2.9 - 0.52 * i, 0), (a.element.drawOrder = -500);
        let n = a.findByName("Trophy Icon");
        (n.element.drawOrder = -500),
          1 == i
            ? (n.element.color = new pc.Color(1, 0.843, 0, 1))
            : 2 == i
            ? (n.element.color = new pc.Color(0.752, 0.752, 0.752, 1))
            : 3 == i
            ? (n.element.color = new pc.Color(0.804, 0.498, 0.196, 1))
            : ((n.element.opacity = 0.5),
              (n.element.color = new pc.Color(1, 1, 1, 1)));
        let o = a.findByName("Rank Num");
        (o.element.drawOrder = -500), (o.element.text = i);
        let r = a.findByName("Num Votes");
        (r.element.drawOrder = -500),
          (r.element.text = t[e].numVotes),
          (a.findByName("Star Icon").element.drawOrder = -500);
        let h = a.findByName("Player Name");
        (h.element.drawOrder = -500),
          (h.element.text = s),
          this.highScoresContainer.addChild(a),
          (i += 1);
      }
    }
  }),
  (Competition.prototype._getPlayerName = function (t) {
    if (t == this.app.server.clientId) return this.app.globals.playerName;
    {
      const e = this.app.remotePlayers[t];
      return e ? e.script.remotePlayer.playerName : "";
    }
  }),
  (Competition.prototype._walkingPlayerLeft = function () {
    (this._walkingPlayer = null), this.cameras.runwayCameraPlayerLeft();
  });
var Input = pc.createScript("input");
Input.attributes.add("placeholder", { type: "string" }),
  Input.attributes.add("type", {
    type: "string",
    enum: [{ Text: "text" }, { Email: "email" }, { Password: "password" }],
    default: "text",
  }),
  Input.attributes.add("fontSize", { type: "number", default: 1 }),
  Input.attributes.add("padding", { type: "number", default: 1 }),
  Input.attributes.add("scaleUnit", {
    type: "string",
    enum: [
      { "Viewport Width": "vw" },
      { "Viewport Height": "vh" },
      { Pixel: "px" },
    ],
    default: "vw",
  }),
  Input.attributes.add("maxLength", { type: "number" }),
  Input.attributes.add("color", { type: "rgb" }),
  Input.attributes.add("backgroundColor", { type: "rgb" }),
  Input.attributes.add("fontFamily", {
    type: "string",
    default: "Arial, sans-serif",
  }),
  Input.attributes.add("storeValue", { type: "boolean" }),
  Input.attributes.add("focusEntity", { type: "entity" }),
  Input.attributes.add("onChangeEvent", { type: "string" }),
  Input.attributes.add("onFocusEvent", { type: "string" }),
  Input.attributes.add("onBlurEvent", { type: "string" }),
  (Input.prototype.initialize = function () {
    (this.inputField = document.createElement("input")),
      (this.inputField.placeholder = this.placeholder),
      (this.inputField.type = this.type),
      this.maxLength > 0 && (this.inputField.maxLength = this.maxLength),
      (this.inputField.style.position = "absolute"),
      (this.inputField.style.fontFamily = this.fontFamily),
      (this.inputField.style.border = "0px");
    var t =
      "rgb(" +
      255 * this.backgroundColor.r +
      ", " +
      255 * this.backgroundColor.g +
      ", " +
      255 * this.backgroundColor.b +
      ")";
    (this.inputField.style.backgroundColor = t),
      (this.inputField.style.fontSize = this.fontSize + "px"),
      (this.inputField.style.padding = this.padding + this.scaleUnit),
      (this.inputField.style.boxSizing = "border-box");
    var i =
      "rgb(" +
      255 * this.color.r +
      ", " +
      255 * this.color.g +
      ", " +
      255 * this.color.b +
      ")";
    ((this.inputField.style.color = i),
    (this.inputField.style.outline = "none"),
    document.body.appendChild(this.inputField),
    this.focusEntity && (this.focusEntity.enabled = !1),
    (this.inputField.onfocus = this.onFocus.bind(this)),
    (this.inputField.onblur = this.onBlur.bind(this)),
    (this.inputField.onchange = this.onChange.bind(this)),
    this.storeValue) &&
      window.localStorage.getItem(this.entity._guid) &&
      this.setValue(window.localStorage.getItem(this.entity._guid));
    this.updateStyle(),
      this.app.graphicsDevice.on("resizecanvas", this.updateStyle, this),
      this.app.on("resizeInputs", this.updateStyle, this),
      this.on(
        "state",
        function (t) {
          this.entity.enabled
            ? ((this.inputField.style.display = "block"), this.updateStyle())
            : ((this.inputField.style.display = "none"), this.updateStyle());
        },
        this
      );
  }),
  (Input.prototype.onFocus = function () {
    this.focusEntity && (this.focusEntity.enabled = !0),
      this.onFocusEvent && this.app.fire(this.onFocusEvent);
  }),
  (Input.prototype.forceBlur = function () {
    this.inputField && (this.inputField.blur(), this.onBlur());
  }),
  (Input.prototype.onBlur = function () {
    this.focusEntity && (this.focusEntity.enabled = !1),
      this.onBlurEvent && this.app.fire(this.onBlurEvent);
  }),
  (Input.prototype.onChange = function () {
    this.storeValue &&
      window.localStorage.setItem(this.entity._guid, this.getValue()),
      this.onChangeEvent && this.app.fire(this.onChangeEvent, this.getValue());
  }),
  (Input.prototype.updateStyle = function () {
    this.entity.element.screenCorners &&
      setTimeout(
        function () {
          let t = this.entity.element.screenCorners,
            i = window.devicePixelRatio;
          (this.inputField.style.left = "calc(" + t[0].x / i + "px + 1vw)"),
            (this.inputField.style.bottom = "calc(" + t[0].y / i + "px + 1vw)"),
            (this.inputField.style.width =
              "calc(" + (t[2].x - t[0].x) / i + "px - 2vw)"),
            (this.inputField.style.height =
              "calc(" + (t[2].y - t[0].y) / i + "px - 2vw)");
        }.bind(this),
        20
      );
  }),
  (Input.prototype.setValue = function (t) {
    this.inputField.value = t;
  }),
  (Input.prototype.getValue = function () {
    if (this.inputField) return this.inputField.value;
  }),
  (Input.prototype.hideElement = function () {
    this.inputField.style.display = "none";
  }),
  (Input.prototype.showElement = function () {
    this.inputField.style.display = "block";
  });
var Chat = pc.createScript("chat");
Chat.attributes.add("hudChatBtn", { type: "entity" }),
  Chat.attributes.add("chatbox", { type: "entity" }),
  (Chat.prototype.initialize = function () {
    (this.app.chat = this),
      (this.chatbox.enabled = !0),
      (this.app.globals.keyboardMovementBlocked = !1),
      this.app.on("chatbox:focus", this.onFocus, this),
      this.app.on("chatbox:blur", this.onBlur, this),
      this.app.on("chatbox:send", this._sendMessage, this),
      this.hudChatBtn.button.on(
        "click",
        function () {
          (this.chatbox.enabled = !0),
            (this.hudChatBtn.enabled = !1),
            this.app.fire("chatbox:open");
        },
        this
      ),
      this.app.on(
        "chatbox:close",
        function () {
          (this.chatbox.enabled = !1),
            (this.chatbox.script.chatbox.chatbox.style.display = "none"),
            (this.hudChatBtn.enabled = !0);
        },
        this
      ),
      this.app.on(
        "enterKey",
        function () {
          this.isFocused && this._sendMessage();
        },
        this
      ),
      this.app.on(
        "station:enter",
        function () {
          "portrait" == this.app.globals.layout &&
            ((this.chatbox.enabled = !1), (this.hudChatBtn.enabled = !1));
        },
        this
      ),
      this.app.on(
        "station:exit",
        function () {
          this.hudChatBtn.enabled = !0;
        },
        this
      );
  }),
  (Chat.prototype.postInitialize = function () {
    this.chatbox.script.chatbox.closeClick();
  }),
  (Chat.prototype.onFocus = function () {
    (this.isFocused = !0),
      (this.app.globals.keyboardMovementBlocked = !0),
      (this.app.globals.scrollZoomBlocked = !0),
      "portrait" == this.app.globals.layout &&
        this.isAndroid() &&
        this.chatbox.script.chatbox.moveUp();
  }),
  (Chat.prototype.onBlur = function () {
    (this.isFocused = !1),
      (this.app.globals.keyboardMovementBlocked = !1),
      (this.app.globals.scrollZoomBlocked = !1),
      "portrait" == this.app.globals.layout &&
        this.isAndroid() &&
        this.chatbox.script.chatbox.moveDown();
  }),
  (Chat.prototype.isAndroid = function () {
    return /Android/i.test(navigator.userAgent);
  }),
  (Chat.prototype.processServerMessage = function (t) {
    if (this.chatbox && this.chatbox.script.chatbox.isInitialized()) {
      const e = t[1],
        a = t[2][1][1];
      let s = "";
      if (this.app.server.clientId === e)
        s = this.app.i18n.getText("You", this.app.i18n.locale);
      else {
        const t = this.app.remotePlayers[e];
        if (t.hasLeftGame) return;
        s = t.script.remotePlayer.playerName;
      }
      if (void 0 === s) return;
      s.length <= 0 && (s = "RainbowStyle"),
        this.chatbox.script.chatbox.addMessage(s, a),
        this._displayChatBubble(e, a),
        this._trimChatLength();
    }
  }),
  (Chat.prototype._displayChatBubble = function (t, e) {
    let a;
    a =
      this.app.server.clientId === t
        ? this.app.globals.localPlayer
        : this.app.remotePlayers[t];
    let s = a.findByName("chatBubbleText"),
      i = a.findByName("chatBubbleBg");
    (i.enabled = !0), (s.element.text = e);
    let o = s.element.height;
    (i.element.height = o + 20),
      i.script.fade.fadeIn(),
      i.script.pulse.start(),
      s.script.fade.fadeIn(),
      a.chatBubbleTimeout && clearTimeout(a.chatBubbleTimeout),
      (a.chatBubbleTimeout = setTimeout(() => {
        i.script && i.script.fade.fadeOut(),
          s.script && s.script.fade.fadeOut();
      }, 5e3));
  }),
  (Chat.prototype._trimChatLength = function () {
    const t = this.chatbox.script.chatbox.scrollWrap;
    if (t.children.length > 50) {
      t.children[0].remove();
    }
  }),
  (Chat.prototype._sendMessage = function () {
    let t = this.chatbox.script.chatbox.getValue();
    t &&
      (this.chatbox.script.chatbox.setValue(""),
      this._sendToServer(t),
      (this.app.tracking.numChatMessagesSent += 1),
      this.app.fire(
        "watcher:track",
        "num_chat_messages_sent_" + this.app.tracking.numChatMessagesSent
      )),
      "portrait" === this.app.globals.layout &&
        this.chatbox.script.chatbox.forceBlur();
  }),
  (Chat.prototype._sendToServer = function (t) {
    const e = [
      this.app.networkCodes.COMMUNICATION,
      [
        [
          [1, 4],
          [3, t],
        ],
      ],
    ];
    this.app.server.send(MessagePack.encode(e));
  });
var UiDbColorList = pc.createScript("uiDbColorList");
UiDbColorList.attributes.add("uiBodyColorTemplate", {
  type: "asset",
  assetType: "template",
}),
  UiDbColorList.attributes.add("uiItemColorTemplate", {
    type: "asset",
    assetType: "template",
  }),
  UiDbColorList.attributes.add("colorContainerTemplate", {
    type: "asset",
    assetType: "template",
  }),
  UiDbColorList.attributes.add("baseSprite", { type: "asset" }),
  UiDbColorList.attributes.add("uiElementColors", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "key",
        type: "string",
        description: "This color will be available as this.app.uiColors['key']",
      },
      { name: "color", type: "rgba" },
    ],
  }),
  UiDbColorList.attributes.add("groups", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "dbColorGroup",
        type: "entity",
        description:
          "The parent entity that contains the dbColors we'd like to populate from",
      },
      {
        name: "scrollViewContent",
        type: "entity",
        description:
          "The entity where the color buttons will be added. This should be a Content element with a layoutgroup component",
      },
      {
        name: "colorType",
        type: "string",
        enum: [{ body: "body" }, { item: "item" }],
        description:
          "Should this group use the body color or item color template",
      },
    ],
  }),
  (UiDbColorList.prototype.initialize = function () {
    (this.app.uiColors = {}),
      this.uiElementColors.forEach((t) => {
        this.app.uiColors[t.key] = t.color;
      });
    for (let t in this.groups) {
      const e = this.groups[t];
      let o,
        i = e.dbColorGroup,
        r = 0,
        s = null;
      (o = "skinColors" == i.name ? 40 : 24),
        "body" == e.colorType
          ? i.children.forEach(function (t) {
              if (!1 === t.enabled) return;
              (0 !== r && r % o != 0) ||
                ((s = this.colorContainerTemplate.resource.instantiate()),
                e.scrollViewContent.addChild(s),
                s.tags.add("horizontal"),
                (r = 0));
              const i = t.script.dbBodyColor;
              this._createBodyColorUI(i, s), r++;
            }, this)
          : i.children.forEach(function (t) {
              if (!1 === t.enabled) return;
              (0 !== r && r % o != 0) ||
                ((s = this.colorContainerTemplate.resource.instantiate()),
                e.scrollViewContent.addChild(s),
                s.tags.add("vertical"),
                (r = 0));
              const i = t.script.dbItemColor;
              this._createItemColorUI(i, s), r++;
            }, this);
    }
  }),
  (UiDbColorList.prototype._createBodyColorUI = function (t, e) {
    const o = this.uiBodyColorTemplate.resource.instantiate();
    (o.name = t.entity.name),
      (o.element.color = t.color),
      (o.button.hoverTint = t.color),
      (o.button.pressedTint = t.color),
      e.addChild(o);
    let i = o.script.bodyColors;
    if (
      ((i.category = t.category),
      (i.mainColorHex = t.mainColorHex),
      (i.shadingColorHex = t.shadingColorHex),
      (i.eyebrowColorHex = t.eyebrowColorHex),
      (i.isPremium = t.isPremium),
      o.tags.add(t.category + "ColorButton"),
      t.isPremium)
    ) {
      o.findByName("adIcon").enabled = !0;
    }
    o.tags.has("hairColorButton")
      ? this.app.colorDb.hairColorItems.push(o)
      : o.tags.has("skinColorButton")
      ? this.app.colorDb.skinColorItems.push(o)
      : o.tags.has("eyeColorButton")
      ? this.app.colorDb.eyeColorItems.push(o)
      : o.tags.has("lipColorButton")
      ? this.app.colorDb.lipColorItems.push(o)
      : o.tags.has("blushColorButton") &&
        this.app.colorDb.blushColorItems.push(o);
  }),
  (UiDbColorList.prototype._createItemColorUI = function (t, e) {
    const o = this.uiItemColorTemplate.resource.instantiate();
    (o.name = t.entity.name),
      (o.element.color = t.color),
      (o.button.hoverTint = t.color),
      (o.button.pressedTint = t.color),
      e.addChild(o);
    let i = o.script.colorButton;
    if (
      ((i.isPremium = t.isPremium),
      (i.material = t.material),
      t.useCustomSprite
        ? (o.tags.add("customSprite"),
          (i.hasCustomSprite = !0),
          (o.element.spriteAsset = t.customSprite),
          t.isAnimatedSprite &&
            (o.tags.add("colorAnim"),
            o.script.create("animateSprite"),
            (o.script.animateSprite.playing = !0),
            (o.script.animateSprite.frames = 3),
            (o.script.animateSprite.frameRate = 8)),
          t.isPattern && o.tags.add("pattern"))
        : (o.element.spriteAsset = this.baseSprite),
      t.isPremium)
    ) {
      o.findByName("adIcon").enabled = !0;
    }
  });
var DbItemColor = pc.createScript("dbItemColor");
DbItemColor.attributes.add("color", { type: "rgb" }),
  DbItemColor.attributes.add("isPremium", { type: "boolean" }),
  DbItemColor.attributes.add("isPattern", { type: "boolean", default: !1 }),
  DbItemColor.attributes.add("useCustomSprite", {
    type: "boolean",
    default: !1,
    description:
      "Use when the color has a custom sprite to show in the color slot, e.g. shaders, gradients, patterns",
  }),
  DbItemColor.attributes.add("isAnimatedSprite", {
    type: "boolean",
    default: !1,
    description: "Use when the custom sprite is an animated sprite",
  }),
  DbItemColor.attributes.add("customSprite", {
    type: "asset",
    description: "The custom sprite to use when useCustomSprite is true",
  }),
  DbItemColor.attributes.add("material", {
    type: "asset",
    description: "The material to use when the color is applied",
  });
var DbBodyColor = pc.createScript("dbBodyColor");
DbBodyColor.attributes.add("category", {
  type: "string",
  enum: [
    { Hair: "hair" },
    { Skin: "skin" },
    { Eye: "eye" },
    { Lips: "lip" },
    { Blush: "blush" },
  ],
}),
  DbBodyColor.attributes.add("color", { type: "rgb" }),
  DbBodyColor.attributes.add("colorShading", { type: "rgb" }),
  DbBodyColor.attributes.add("mainColorHex", { type: "string" }),
  DbBodyColor.attributes.add("shadingColorHex", { type: "string" }),
  DbBodyColor.attributes.add("eyebrowColorHex", { type: "string" }),
  DbBodyColor.attributes.add("isPremium", { type: "boolean" }),
  (DbBodyColor.prototype.initialize = function () {});
var Stars = pc.createScript("stars");
Stars.attributes.add("uiGroup", { type: "entity" }),
  Stars.attributes.add("numberUi", { type: "entity" }),
  Stars.attributes.add("locations", { type: "vec3", array: !0 }),
  (Stars.prototype.initialize = function () {
    (this.pos = new pc.Vec3()),
      this.pos.copy(this.entity.getPosition()),
      (this.bbx = new pc.BoundingBox(
        new pc.Vec3(this.pos.x, this.pos.y, this.pos.z),
        new pc.Vec3(0.9, 0.9, 0.9)
      )),
      this.app.on(
        "disableAnimColors",
        function () {
          this.app.globals.ui.findByTag("pattern").forEach(function (t) {
            t.enabled = !1;
          });
        },
        this
      ),
      this.app.on(
        "station:exit",
        function () {
          this.app.globals.ui.findByTag("pattern").forEach(function (t) {
            t.enabled = !0;
          });
        },
        this
      ),
      this.app.on(
        "intersectStar",
        function (t) {
          t == this.entity.name && this.intersectStar();
        },
        this
      );
  }),
  (Stars.prototype.intersectStar = function () {
    this.setNewLocation(),
      this.app.fire("upwardTone"),
      this.app.fire("stars:earn", 1),
      this.app.fire("getStar"),
      (1 != this.app.globals.starCount &&
        this.app.globals.starCount % 5 != 0) ||
        this.app.fire(
          "watcher:track",
          "stars_collected_" + this.app.globals.starCount
        );
  }),
  (Stars.prototype.setNewLocation = function () {
    let t = this.locations;
    const i = t[Math.floor(Math.random() * t.length)];
    this.entity.setPosition(i), this.bbx.center.set(i.x, i.y, i.z);
  });
var BoundingBox = pc.createScript("boundingBox");
(BoundingBox.prototype.initialize = function () {
  this.entity.collision ||
    console.error(
      "BoundingBox script requires a collision component on entity " +
        this.entity.name
    );
}),
  (BoundingBox.prototype.contains = function (n) {
    const i = this.entity.getPosition(),
      o = this.entity.collision.halfExtents;
    return (
      n.x > i.x - o.x &&
      n.x < i.x + o.x &&
      n.y > i.y - o.y &&
      n.y < i.y + o.y &&
      n.z > i.z - o.z &&
      n.z < i.z + o.z
    );
  });
var MovementPath = pc.createScript("movementPath");
MovementPath.attributes.add("posPath", {
  type: "curve",
  curves: ["x", "y", "z"],
}),
  MovementPath.attributes.add("eulerPath", {
    type: "curve",
    curves: ["x", "y", "z"],
  }),
  (MovementPath.prototype.initialize = function () {
    (this._countdownS = 0), (this._pathTimeS = 0);
  }),
  (MovementPath.prototype.setPathTimeS = function (t) {
    (this._countdownS = t), (this._pathTimeS = t);
  }),
  (MovementPath.prototype.update = function (t) {
    let e = this._countdownS;
    if (e > 0) {
      e -= t;
      const i = 1 - e / this._pathTimeS,
        o = this.posPath.value(i);
      this.entity.setPosition(o[0], o[1], o[2]);
      const n = this.eulerPath.value(i);
      this.entity.setEulerAngles(n[0], n[1], n[2]), (this._countdownS = e);
    }
  });
var CompetitionCameras = pc.createScript("competitionCameras");
CompetitionCameras.attributes.add("mainCamera", {
  type: "entity",
  description: "Main camera entity that follows the localPlayer",
}),
  CompetitionCameras.attributes.add("awardsCamera", {
    type: "entity",
    description: "Camera entity used for the podium awards",
  }),
  CompetitionCameras.attributes.add("runwayCamera", {
    type: "entity",
    description: "Camera entity used the showtime runway",
  }),
  (CompetitionCameras.prototype.initialize = function () {
    (this.awardsCamera.enabled = !1), (this.runwayCamera.enabled = !1);
  }),
  (CompetitionCameras.prototype.runwayCameraLookAtPlayer = function (a) {
    this.runwayCamera.reparent(a),
      this.runwayCamera.setLocalEulerAngles(-9, 40, 0),
      this.runwayCamera.setLocalPosition(2.7, 1.1, 3.2);
  }),
  (CompetitionCameras.prototype.runwayCameraPlayerLeft = function () {
    this.runwayCamera.reparent(this.app.root),
      this.runwayCamera.setEulerAngles(0, 0, 0),
      this.runwayCamera.setPosition(308, 1.7, 3.6);
  }),
  (CompetitionCameras.prototype.runwayCameraTrackWalk = function (a) {
    this.runwayCamera.setLocalPosition(2.7, 1.1 + 1 * a, 3.2);
  }),
  (CompetitionCameras.prototype.runwayCameraViewFrontOn = function () {
    this.runwayCamera.setLocalPosition(0, 1.8, 5.5),
      this.runwayCamera.setLocalEulerAngles(-6, 0, 0);
  }),
  (CompetitionCameras.prototype.awardsCameraStartMovement = function (a) {
    this.awardsCamera.script.movementPath.setPathTimeS(a);
  }),
  (CompetitionCameras.prototype.exit = function () {
    (this.mainCamera.enabled = !0),
      (this.awardsCamera.enabled = !1),
      (this.runwayCamera.enabled = !1);
  }),
  (CompetitionCameras.prototype.setPhase = function (a) {
    (this.mainCamera.enabled = !1),
      (this.awardsCamera.enabled = !1),
      (this.runwayCamera.enabled = !1),
      "showtime" === a
        ? (this.runwayCamera.enabled = !0)
        : "awards" === a
        ? (this.runwayCamera.reparent(this.app.root),
          (this.awardsCamera.enabled = !0),
          (this.awardsCamera.camera.fov =
            "portrait" == this.app.globals.layout ? 60 : 40))
        : "dressing" === a && (this.mainCamera.enabled = !0);
  });
var CompetitionHud = pc.createScript("competitionHud");
CompetitionHud.attributes.add("label", {
  type: "entity",
  description: "UI label for the event the timer is counting down to",
}),
  CompetitionHud.attributes.add("timer", {
    type: "entity",
    description: "The timer value in seconds eg 22.5s",
  }),
  CompetitionHud.attributes.add("labelBg", {
    type: "entity",
    description: "Background for the label",
  }),
  CompetitionHud.attributes.add("votingUI", {
    type: "entity",
    description: "Container for the star voting buttons",
  }),
  CompetitionHud.attributes.add("emotesHudButton", {
    type: "entity",
    description: "HUD button that opens emotes panel",
  }),
  CompetitionHud.attributes.add("jumpButton", {
    type: "entity",
    description:
      "HUD button that makes the player jump, hidden during showtime and awards",
  }),
  CompetitionHud.attributes.add("uiFadeCover", {
    type: "entity",
    description:
      "The entity full screen cover element shown when we fade to black",
  }),
  CompetitionHud.attributes.add("showtimeReadyArea", {
    type: "entity",
    description: "Area players can use to skip dressing time",
  }),
  CompetitionHud.attributes.add("numPlayersReady", {
    type: "entity",
    description: "UI element showing the number of players ready for showtime",
  }),
  CompetitionHud.attributes.add("labelSubpanel", {
    type: "entity",
    description: "panel that appears in the ready up area",
  }),
  CompetitionHud.attributes.add("readyGroup", { type: "entity" }),
  CompetitionHud.attributes.add("votingGroup", { type: "entity" }),
  CompetitionHud.attributes.add("chatScript", { type: "entity" }),
  CompetitionHud.attributes.add("disableDuringShowtime", {
    type: "entity",
    array: !0,
    description: "HUD entities to hide during the runway show phase",
  }),
  CompetitionHud.attributes.add("starButtons", {
    type: "json",
    schema: [
      { type: "entity", name: "starButton1" },
      { type: "entity", name: "starButton2" },
      { type: "entity", name: "starButton3" },
      { type: "entity", name: "starButton4" },
      { type: "entity", name: "starButton5" },
    ],
  }),
  (CompetitionHud.prototype.initialize = function () {
    (this.theme = ""),
      (this.timerValue = ""),
      (this.walkingClientId = 0),
      (this._voteNumCast = 0),
      (this._starSelectedColor = new pc.Color(1, 0.46, 0.85, 1)),
      (this._starUnselectedColor = new pc.Color(0.94, 0.93, 1, 1));
    let t = this.starButtons;
    [1, 2, 3, 4, 5].forEach((e) => {
      const i = t[`starButton${e}`].button;
      i.on("click", this._vote.bind(this, e)),
        i.on("mouseenter", this._hoverStar.bind(this, e)),
        i.on("mouseleave", this._mouseLeave.bind(this)),
        i.on("touchstart", this._hoverStar.bind(this, e));
    }),
      this.app.on("menu:close", this._onMenuClose, this),
      this.app.on("runway:player:walk", this._resetVoteState, this),
      this.app.on("instance:change", () => {
        this.votingUI.enabled = !1;
      }),
      this.app.on("remote:player:area:update", this._updateShowtimeReady, this),
      this.app.on("showtime:ready:enter", () => {
        (this.labelSubpanel.enabled = !0),
          (this.readyGroup.enabled = !0),
          (this.votingGroup.enabled = !1),
          this._updateShowtimeReady();
      }),
      this.app.on("showtime:ready:exit", () => {
        (this.labelSubpanel.enabled = !1),
          (this.readyGroup.enabled = !1),
          (this.votingGroup.enabled = !0);
      });
  }),
  (CompetitionHud.prototype._onMenuClose = function () {
    "competition" == this.app.instance.name &&
      (("showtime" != this.app.competition.phase &&
        "awards" != this.app.competition.phase) ||
        (this.app.globals.movementAllowed = !1));
  }),
  (CompetitionHud.prototype._resetVoteState = function () {
    (this._voteNumCast = 0), this._hoverStar(0);
  }),
  (CompetitionHud.prototype._vote = function (t) {
    const e = [
      this.app.networkCodes.COMMUNICATION,
      [
        [
          [1, 3],
          [1, t],
          [1, this.walkingClientId],
        ],
      ],
    ];
    this.app.server.send(MessagePack.encode(e)),
      (this._voteNumCast = t),
      (this.votingUI.script.pulse.continuous = !1),
      !1 === this.app.tracking.competitionVoteCast &&
        ((this.app.tracking.competitionVoteCast = !0),
        this.app.fire("watcher:track", "first_competition_vote_cast")),
      this.app.fire("watcher:track", "competition_vote_" + t + "_stars");
  }),
  (CompetitionHud.prototype._hoverStar = function (t) {
    let e = this.starButtons;
    for (let i = 0; i < 5; i++)
      e["starButton" + (i + 1)].element.color =
        i < t ? this._starSelectedColor : this._starUnselectedColor;
  }),
  (CompetitionHud.prototype._mouseLeave = function () {
    this._hoverStar(this._voteNumCast);
  }),
  (CompetitionHud.prototype.updateDisplay = function (t) {
    switch (
      ((this.labelBg.enabled = !1),
      (this.label.enabled = !1),
      (this.timer.enabled = !1),
      t)
    ) {
      case "dressing":
        (this.labelBg.enabled = !0),
          (this.label.enabled = !0),
          (this.timer.enabled = !0),
          (this.votingUI.enabled = !1),
          (this.label.element.text = window.ucWords(this.theme)),
          (this.timer.element.text = this.timerValue);
        break;
      case "showtime": {
        const t = this.walkingClientId == this.app.server.clientId;
        (this.jumpButton.enabled = !1),
          (this.labelSubpanel.enabled = !1),
          (this.emotesHudButton.enabled = !!t),
          this.disableDuringShowtime.forEach(function (t) {
            t.enabled = !1;
          });
        let e = this.votingUI;
        (e.enabled = !t),
          e.enabled &&
            this._voteNumCast <= 0 &&
            0 == e.script.pulse.isPulsing() &&
            ((e.script.pulse.continuous = !0), e.script.pulse.start());
        let i = this.emotesHudButton.script.pulse;
        t && 0 == i.isPulsing() ? i.start() : 0 == t && i.stop(),
          this.chatScript.script.chat.chatbox &&
          this.chatScript.script.chat.chatbox.enabled
            ? this.app.fire("moveVoteUi", !0)
            : this.app.fire("moveVoteUi", !1);
        break;
      }
      case "awards": {
        (this.labelBg.enabled = !0),
          (this.label.enabled = !0),
          (this.labelSubpanel.enabled = !1),
          (this.votingUI.enabled = !1),
          (this.jumpButton.enabled = !1);
        let t = this.app.i18n.getText("Awards: ", this.app.i18n.locale);
        (this.label.element.text = t + this.theme),
          (this.emotesHudButton.enabled = !0),
          this.emotesHudButton.script.pulse.stop();
        break;
      }
    }
  }),
  (CompetitionHud.prototype.enter = function () {
    this.app.screenSystem.closeActiveScreen();
  }),
  (CompetitionHud.prototype.exit = function () {
    (this.theme = ""),
      (this.walkingClientId = 0),
      this.disableDuringShowtime.forEach(function (t) {
        t.enabled = !0;
      }),
      this.app.isUsingTouch
        ? (this.jumpButton.enabled = !0)
        : (this.jumpButton.enabled = !1);
  }),
  (CompetitionHud.prototype.fadeToBlack = function (t = 1) {
    (this.uiFadeCover.enabled = !0),
      this.uiFadeCover.script.fadeToBlack.start(t);
  }),
  (CompetitionHud.prototype._updateShowtimeReady = function () {
    if ("dressing" == this.app.competition.phase) {
      let t = 0,
        e = 1;
      this.showtimeReadyArea.script.competitionWaitingArea
        .isLocalPlayerInside && (t += 1);
      for (const i in this.app.remotePlayers) {
        "showtime:ready" ==
          this.app.remotePlayers[i].script.playerArea.currentArea && (t += 1),
          (e += 1);
      }
      this.numPlayersReady.element.text = t + "/" + e;
    }
  });
var LocalPlayerMovement = pc.createScript("localPlayerMovement");
LocalPlayerMovement.attributes.add("thumbstick", { type: "entity" }),
  LocalPlayerMovement.attributes.add("starGroup", { type: "entity" }),
  LocalPlayerMovement.attributes.add("starGroup2", { type: "entity" }),
  LocalPlayerMovement.attributes.add("speed", { type: "number", default: 1 }),
  LocalPlayerMovement.attributes.add("jumpDurationS", {
    type: "number",
    default: 0.35,
  }),
  LocalPlayerMovement.attributes.add("jumpYVelocity", { type: "curve" }),
  LocalPlayerMovement.attributes.add("playerMesh", { type: "entity" }),
  LocalPlayerMovement.attributes.add("animFollowButton", { type: "entity" }),
  (LocalPlayerMovement.prototype.initialize = function () {
    (this.stationPos = new pc.Vec3()),
      (this._jumpCountdownS = 0),
      (this._jumpedForTheFirstTime = !1),
      (this.charAnims = this.app.globals.localCharAnims),
      this.entity.on("land", this._land, this),
      this.app.on("station:exit", this._onStationExit, this),
      this.app.on("competition:phase:start", this._hideFollowButton, this),
      this.entity.on("collide:x", () => {
        this._currentVelocity.x = 0;
      }),
      this.entity.on("collide:z", () => {
        this._currentVelocity.z = 0;
      }),
      (this.currentStation = null),
      (this._playerPos = new pc.Vec3()),
      (this._currentCharacterQuat = new pc.Quat()),
      (this._targetCharacterQuat = new pc.Quat()),
      (this._currentVelocity = new pc.Vec3()),
      (this._remoteCharAnimJoinTarget = null),
      this.animFollowButton.on(
        "button:clicked",
        this._animFollowButtonClicked,
        this
      );
  }),
  (LocalPlayerMovement.prototype.getCurrentVelocity = function () {
    return this._currentVelocity;
  }),
  (LocalPlayerMovement.prototype.getInputPercentage = function () {
    return this.app.inputState.isUsingKeyboardToMove()
      ? 1
      : this.thumbstick.script.uiThumbstick.getInputPercentage();
  }),
  (LocalPlayerMovement.prototype.update = function (t) {
    if (
      (this.charAnims.setSpeed(1),
      this.app.globals.movementAllowed &&
        !1 === this.entity.positionOverrideActive &&
        !1 === this.app.globals.isAdPlaying)
    ) {
      const e = t / (1 / 60);
      this._updateInput(e),
        this._updateAngle(e),
        this._updateVelocity(e),
        this._updateJump(e),
        this._applyFriction(e),
        this._updatePosition(e),
        this._resolveCollisions(e),
        this._updateAnimations(e);
    }
    FrameTracker.num % 3 == 0 &&
      (this.checkStationCollisions(), this.checkStarCollisions()),
      FrameTracker.num % 5 == 0 &&
        (this.checkTeleportCollisions(), this.checkWaitingAreaCollisions()),
      FrameTracker.num % 7 == 0 &&
        (this.app.collectibles.checkCollisions(this.entity),
        this.app.prizeChests.checkCollisions(this.entity)),
      FrameTracker.num % 10 == 0 &&
        this.app.vipRoom.checkCollisions(this.entity),
      FrameTracker.num % 20 == 0 && this.checkRemotePlayerProximities();
  }),
  (LocalPlayerMovement.prototype._updateInput = function (t) {
    let e = this.app.inputState;
    this.app.inputState.isTouching ||
    e.isUsingMouseToMove() ||
    e.isUsingKeyboardToMove()
      ? (e.pressingAny = !0)
      : (e.pressingAny = !1),
      e.pressingAny &&
        this.charAnims.isFollowingPlayer() &&
        (this.charAnims.setAnimInteger(0), this.charAnims.clearFollowPlayer()),
      e.isUsingKeyboardToMove() &&
        (e.pressingLeft && e.pressingUp
          ? (e.angleDeg = 135)
          : e.pressingRight && e.pressingUp
          ? (e.angleDeg = 45)
          : e.pressingLeft && e.pressingDown
          ? (e.angleDeg = 225)
          : e.pressingRight && e.pressingDown
          ? (e.angleDeg = 315)
          : e.pressingLeft
          ? (e.angleDeg = 180)
          : e.pressingRight
          ? (e.angleDeg = 0)
          : e.pressingUp
          ? (e.angleDeg = 90)
          : e.pressingDown
          ? (e.angleDeg = 270)
          : (e.pressingAny = !1));
  }),
  (LocalPlayerMovement.prototype._updateAngle = function (t) {
    let e = this.entity,
      i = this._targetCharacterQuat,
      n = this._currentCharacterQuat;
    i.setFromEulerAngles(0, 90 + this.app.inputState.angleDeg, 0),
      n.slerp(n, i, 0.2 * t),
      e.setRotation(n);
  }),
  (LocalPlayerMovement.prototype._updateVelocity = function (t) {
    let e = this._currentVelocity;
    const i = this.app.inputState;
    if (i.pressingAny) {
      const n = (i.angleDeg * Math.PI) / 180 + Math.PI / 2,
        o = this.getInputPercentage();
      this.charAnims.setSpeedFromInputPercentage(o);
      let s = 0.01 * this.speed,
        a = Math.sin(n) * s * t * o,
        r = Math.cos(n) * s * t * o;
      i.isJumpInProgress && ((a *= 0.66), (r *= 0.66)), (e.x += a), (e.z += r);
    }
    e.y += this.app.physics.gravity * t;
  }),
  (LocalPlayerMovement.prototype._updateJump = function (t) {
    let e = this.app.inputState;
    if (
      (e.pressingJump &&
        (!1 === e.isJumpInProgress &&
          ((this._jumpCountdownS = this.jumpDurationS),
          (e.isJumpInProgress = !0),
          this.charAnims.setAnimJump(!0)),
        !1 === this._jumpedForTheFirstTime &&
          ((this._jumpedForTheFirstTime = !0),
          this.app.fire("watcher:track", "first_player_jump"))),
      this._jumpCountdownS > 0)
    ) {
      const e = t * (1 / 60);
      this._jumpCountdownS -= e;
      const i = this._jumpCountdownS / this.jumpDurationS;
      this._currentVelocity.y = this.jumpYVelocity.value(i);
    }
  }),
  (LocalPlayerMovement.prototype._land = function () {
    (this._currentVelocity.y = 0),
      this.app.inputState.isJumpInProgress &&
        ((this.app.inputState.isJumpInProgress = !1),
        this.charAnims.setAnimJump(!1));
  }),
  (LocalPlayerMovement.prototype._applyFriction = function (t) {
    let e = 1 - 0.15 * t,
      i = this._currentVelocity;
    (i.x *= e), (i.z *= e);
  }),
  (LocalPlayerMovement.prototype._updatePosition = function (t) {
    let e = this._currentVelocity,
      i = this.entity.getPosition();
    (i.x += e.x * t),
      (i.y += e.y * t),
      (i.z += e.z * t),
      this.entity.setPosition(i),
      i.y < -30 &&
        (i.x > -70 &&
          this.app.fire(
            "watcher:track",
            "player_fell_off_map_at_x_" + parseInt(i.x) + "_z_" + parseInt(i.z)
          ),
        this._currentVelocity.set(0, 0, 0),
        this.entity.setPosition(this.app.spawnSystem.getSpawnPosition()));
  }),
  (LocalPlayerMovement.prototype._resolveCollisions = function (t) {
    this.app.physics.resolveCollisions(this.entity, t);
  }),
  (LocalPlayerMovement.prototype._updateAnimations = function (t) {
    if (this.charAnims.isWalking() || this.charAnims.isStrutting()) {
      const t = this.app.inputState;
      !1 === t.isMouseDown &&
        !1 === t.isTouching &&
        0 == t.pressingLeft &&
        0 == t.pressingRight &&
        0 == t.pressingUp &&
        0 == t.pressingDown &&
        this.charAnims.setAnimIdle();
    }
  }),
  (LocalPlayerMovement.prototype.checkStationCollisions = function () {
    let t = this.entity.getPosition();
    if (null != this.currentStation)
      !1 === this.currentStation.contains(t) && (this.currentStation = null);
    else {
      if (
        "awards" == this.app.competition.phase ||
        "showtime" == this.app.competition.phase
      )
        return;
      this.app.areaSystem.stations.forEach(function (e) {
        e.enabled &&
          e.script.station.contains(t) &&
          ((null != this.currentStation &&
            e.script.station.name == this.currentStation.name) ||
            (this.app.stationSystem.activate(e.script.station),
            (this.currentStation = e.script.station),
            this.alignPlayer(e)));
      }, this);
    }
  }),
  (LocalPlayerMovement.prototype.checkStarCollisions = function () {
    const t = this.entity.getPosition();
    if (isNaN(t.x) || isNaN(t.y) || isNaN(t.z)) return;
    if (
      (this._playerPos.set(t.x, t.y, t.z),
      this.starGroup.script.stars.bbx.containsPoint(this._playerPos))
    )
      this.app.fire("intersectStar", "starGroup");
    else {
      this.starGroup2.script.stars.bbx.containsPoint(this._playerPos) &&
        this.app.fire("intersectStar", "starGroup2");
    }
  }),
  (LocalPlayerMovement.prototype.checkTeleportCollisions = function () {
    const t = this.entity.getPosition();
    let e = this.app.areaSystem.teleporters;
    for (let i in e) {
      const n = e[i];
      if (n.enabled && n.script.boundingBox.contains(t)) {
        let t = n.script.teleporter;
        return (
          n.script.teleporterReturn && (t = n.script.teleporterReturn),
          void t.teleport(this.entity)
        );
      }
    }
  }),
  (LocalPlayerMovement.prototype.checkWaitingAreaCollisions = function () {
    const t = this.entity.getPosition();
    this.app.areaSystem.waitingAreas.forEach(function (e) {
      e.enabled &&
        e.script.boundingBox.contains(t) &&
        e.script.competitionWaitingArea.enter(this.entity);
    }, this);
  }),
  (LocalPlayerMovement.prototype.alignPlayer = function (t) {
    this.entity.setPosition(
      t.getPosition().x,
      t.getPosition().y + 0.7,
      t.getPosition().z
    );
    const e = t.script.station.playerRot;
    this.entity
      .tween(this.entity.getLocalEulerAngles())
      .rotate(e, 1, pc.CubicInOut)
      .start(),
      this.charAnims.setAnimIdle();
  }),
  (LocalPlayerMovement.prototype._onStationExit = function () {
    this._currentVelocity.set(0, 0, 0),
      (this._jumpCountdownS = 0),
      this.faceCamera();
  }),
  (LocalPlayerMovement.prototype.faceCamera = function () {
    (this.app.inputState.angleDeg = 270),
      this._targetCharacterQuat.setFromEulerAngles(
        0,
        90 + this.app.inputState.angleDeg,
        0
      ),
      this._currentCharacterQuat.copy(this._targetCharacterQuat);
  }),
  (LocalPlayerMovement.prototype.checkRemotePlayerProximities = function () {
    if (this.charAnims.isFollowingPlayer()) return;
    if (null != this._remoteCharAnimJoinTarget) {
      if (
        this._remoteCharAnimJoinTarget.hasLeftGame ||
        !1 === this._remoteCharAnimJoinTarget.enabled
      )
        return void this._hideFollowButton();
      if (
        this._remoteCharAnimJoinTarget.script.charAnims.anim.getInteger(
          "pose"
        ) <= 0
      )
        this._hideFollowButton();
      else {
        this._remoteCharAnimJoinTarget
          .getPosition()
          .distance(this.entity.getPosition()) > 2 && this._hideFollowButton();
      }
      return;
    }
    let t = [];
    for (const e in this.app.remotePlayers) {
      let i = this.app.remotePlayers[e];
      const n = i.script.charAnims;
      if (n.canBeFollowed()) {
        if (n.getFollowPlayerClientId() == this.app.server.clientId) continue;
        const e = i.getPosition().distance(this.entity.getPosition());
        e <= 2 && t.push({ distance: e, player: i });
      }
    }
    if (t.length > 0) {
      t.sort(function (t, e) {
        return t.distance - e.distance;
      });
      const e = t[0].player;
      (this._remoteCharAnimJoinTarget = e),
        this.animFollowButton.script.playerButtonMarker.show(e);
    }
  }),
  (LocalPlayerMovement.prototype._hideFollowButton = function () {
    (this._remoteCharAnimJoinTarget = null),
      this.animFollowButton.script.playerButtonMarker.hide();
  }),
  (LocalPlayerMovement.prototype._animFollowButtonClicked = function () {
    this.app.fire("watcher:track", "player_anim_follow"),
      this.app.fire("anim:follow", this._remoteCharAnimJoinTarget),
      this._hideFollowButton();
  });
var FadeToBlack = pc.createScript("fadeToBlack");
FadeToBlack.attributes.add("opacityCurve", {
  type: "curve",
  default: { keys: [0, 0, 0.5, 1, 1, 0] },
}),
  (FadeToBlack.prototype.initialize = function () {
    (this._timeS = 0), (this._fadeCountdownS = 0);
  }),
  (FadeToBlack.prototype.update = function (t) {
    if (this._fadeCountdownS > 0) {
      this._fadeCountdownS -= t;
      let e = 1 - this._fadeCountdownS / this._timeS,
        a = this.opacityCurve.value(e),
        i = this.entity;
      i.element ? (i.element.opacity = a) : i.sprite && (i.sprite.opacity = a),
        this._fadeCountdownS <= 0 &&
          (this.app.fire("poki:gameplayStart"), (this.entity.enabled = !1));
    }
  }),
  (FadeToBlack.prototype.start = function (t = 1) {
    this.app.fire("poki:gameplayStop"),
      (this._timeS = t),
      (this._fadeCountdownS = t);
  });
var AutoQa = pc.createScript("autoQa");
AutoQa.attributes.add("verbose", {
  type: "boolean",
  default: !1,
  description: "If true, will log more information to the console",
}),
  AutoQa.attributes.add("premiumReport", {
    type: "boolean",
    default: !1,
    description: "If true, will report on premium & VIP item percentages",
  }),
  AutoQa.attributes.add("disabledOnInit", {
    type: "entity",
    array: !0,
    description: "Entities that should be disabled when exporting a build",
  }),
  (AutoQa.prototype.postInitialize = function () {
    window.location.href.indexOf("launch.playcanvas.com") > 0 &&
      (this.checkDisabledRooms(),
      this.app.on(
        "vipRoom:loaded",
        function () {
          this.runQaChecks();
        }.bind(this)
      ));
  }),
  (AutoQa.prototype.runQaChecks = function () {
    console.log("******Starting Auto QA Checks******"),
      this.checkForMissingAssets(),
      this.checkDbItems(),
      this.checkForAdButtons(),
      console.log("✅ QA checks complete");
  }),
  (AutoQa.prototype.checkForMissingAssets = function () {
    let e = this.app.root.findComponents("render");
    for (let t = 0; t < e.length; t++) {
      let o = e[t].entity.render.asset;
      this.app.assets.get(o) ||
        e[t].entity.name.includes("Slot") ||
        "asset" != e[t].entity.render.type ||
        console.warn("Render entity " + e[t].entity.name + " missing asset");
    }
    console.log("✅ Render entities checked for missing assets");
  }),
  (AutoQa.prototype.checkDbItems = function () {
    let e = this.app.root.findScripts("dbItem"),
      t = {};
    for (let o = 0; o < e.length; o++) {
      let n = e[o];
      this.verbose && console.log("CHECKING DBITEM: ", n.entity.name),
        n.mesh ||
          n.isNoneItem ||
          console.warn("No mesh found for ", n.entity.name),
        n.materials || console.warn("No materials found for ", n.entity.name),
        n.itemCat || console.warn("No item category found for ", n.entity.name),
        "tops" == n.itemCat &&
          n.variations < 3 &&
          console.warn("Not enough variations for ", n.entity.name),
        "shoes" == n.itemCat &&
          null == n.heelHeight &&
          console.warn("No heel height set: ", n.entity.name),
        "bottoms" == n.itemCat &&
          null == n.waistHeight &&
          console.warn("No waist height set: ", n.entity.name),
        "bags" != n.itemCat ||
          0 != n.bagPose ||
          n.isNoneItem ||
          console.warn("No bag pose set: ", n.entity.name),
        n.materials.length < 1 &&
          !n.isNoneItem &&
          console.warn("No materials found for ", n.entity.name);
      let s = 0;
      if (
        (n.materials.forEach((e) => {
          e.name.includes("blender") || s++;
        }),
        "eyes" != n.itemCat &&
          "cheek" != n.itemCat &&
          "hair" != n.itemCat &&
          "lips" != n.itemCat &&
          0 == n.isNoneItem &&
          0 == n.entity.tags.has("plant") &&
          s != n.colorSlots &&
          console.warn("Material and color slots mismatch for ", n.entity.name),
        !n.isNoneItem)
      ) {
        let e = this.app.assets.find(n.mesh.name, "render");
        this.app.assets.load(e),
          e.ready(() => {
            n.materials.length == n.mesh.resource.meshes.length ||
              n.entity.tags.has("plant") ||
              console.warn(
                "Material and meshInstances mismatch for ",
                n.entity.name,
                ". Check if the render asset has correct number of meshes/material slots exported from Blender."
              ),
              this.verbose &&
                (console.log("   Fashion materials array on dbItem " + s),
                console.log("   colorSlots " + n.colorSlots),
                console.log("   dbItem Materials.length " + n.materials.length),
                console.log(
                  "   render asset meshInstances " +
                    n.mesh.resource.meshes.length
                ),
                console.log(n));
          });
      }
      t[n.itemCat] ||
        (t[n.itemCat] = {
          premium: 0,
          vip: 0,
          codes: 0,
          none: 0,
          eventItems: 0,
          regular: 0,
          total: 0,
        }),
        n.isPremium
          ? t[n.itemCat].premium++
          : n.isVIP
          ? t[n.itemCat].vip++
          : n.redeemCode
          ? t[n.itemCat].codes++
          : n.isNoneItem
          ? t[n.itemCat].none++
          : n.eventCurrency
          ? t[n.itemCat].eventItems++
          : n.linkedGardenItemId
          ? t[n.itemCat].gardenItems
            ? t[n.itemCat].gardenItems++
            : (t[n.itemCat].gardenItems = 1)
          : t[n.itemCat].regular++;
    }
    if (
      (console.log("✅ DbItems checked for missing fields"), this.premiumReport)
    ) {
      console.log("**Item Report**");
      for (let e in t) {
        let o = t[e],
          n = o.premium + o.vip + o.codes + o.eventItems + o.regular;
        o.total = n;
        let s = Math.round((o.premium / o.total) * 100);
        console.log(e.toUpperCase()),
          console.log(
            "Total: ",
            o.total,
            " | Premium: ",
            o.premium,
            " | VIP: ",
            o.vip,
            " | Codes: ",
            o.codes,
            " | Regular: ",
            o.regular
          ),
          o.gardenItems &&
            console.log("Additional garden items: ", o.gardenItems),
          0 != o.eventItems && console.log("Events items: ", o.eventItems),
          console.log("Premium: ", s, "% "),
          console.log(" ");
      }
    }
  }),
  (AutoQa.prototype.checkDisabledRooms = function () {
    this.disabledOnInit.forEach(function (e) {
      e.enabled && console.warn(e.name + " should be disabled in export build");
    });
  }),
  (AutoQa.prototype.checkForAdButtons = function () {
    this.app.root.findScripts("bodyColors").forEach(function (e) {
      e.isPremium &&
        e.entity.children.length < 2 &&
        console.warn(
          e.entity.name +
            " is a premium body color, but has no ad icon attached."
        );
    }),
      this.app.root.findScripts("colorButton").forEach(function (e) {
        e.isPremium &&
          e.entity.children.length < 2 &&
          console.warn(
            e.entity.name +
              " is a premium color button, but has no ad icon attached."
          );
      }),
      console.log(
        "✅ BodyColor & fashionColor buttons checked for missing ad icons"
      );
  });
var VipEntrance = pc.createScript("vipEntrance");
VipEntrance.attributes.add("collision", {
  type: "entity",
  description: "Cuboid is skipped to allow player to pass through",
}),
  VipEntrance.attributes.add("leftDoor", { type: "entity" }),
  VipEntrance.attributes.add("rightDoor", { type: "entity" }),
  VipEntrance.attributes.add("doorSwingTime", { type: "number", default: 1 }),
  VipEntrance.attributes.add("timerElement", { type: "entity" }),
  VipEntrance.attributes.add("ticketTrigger", { type: "entity" }),
  VipEntrance.attributes.add("ticketTriggerShadow", {
    type: "entity",
    description:
      "Shadow cannot be instanced, instead of enabling/disabling, we alter the y position to show/hide it",
  }),
  (VipEntrance.prototype.initialize = function () {
    window.setVDynamic(this.leftDoor, !0),
      window.setVDynamic(this.rightDoor, !0),
      (this._swingCountdownS = 0),
      (this._swingDirection = ""),
      (this._isLocked = !0),
      (this._shadowStartY = this.ticketTriggerShadow.getPosition().y);
  }),
  (VipEntrance.prototype.openDoors = function () {
    this._swingCountdownS > 0 ||
      "open" == this._swingDirection ||
      ((this._swingCountdownS = this.doorSwingTime),
      (this._swingDirection = "open"));
  }),
  (VipEntrance.prototype.closeDoors = function () {
    this._swingCountdownS > 0 ||
      "close" == this._swingDirection ||
      ((this._swingCountdownS = this.doorSwingTime),
      (this._swingDirection = "close"));
  }),
  (VipEntrance.prototype._forceCloseDoors = function () {
    (this._swingCountdownS = this.doorSwingTime),
      (this._swingDirection = "close");
  }),
  (VipEntrance.prototype.doorsAreOpen = function () {
    return this._swingCountdownS <= 0 && "open" == this._swingDirection;
  }),
  (VipEntrance.prototype.isUnlocked = function () {
    return !1 === this._isLocked;
  }),
  (VipEntrance.prototype.lock = function () {
    (this._swingCountdownS > 0 || "close" != this._swingDirection) &&
      this._forceCloseDoors(),
      (this.collision.skipCollision = !1),
      (this.ticketTrigger.enabled = !0),
      this.ticketTriggerShadow.setPosition(
        this.ticketTriggerShadow.getPosition().x,
        this._shadowStartY,
        this.ticketTriggerShadow.getPosition().z
      ),
      (this._isLocked = !0);
  }),
  (VipEntrance.prototype.unlock = function () {
    (this.collision.skipCollision = !0),
      (this.ticketTrigger.enabled = !1),
      this.ticketTriggerShadow.setPosition(
        this.ticketTriggerShadow.getPosition().x,
        this._shadowStartY - 0.5,
        this.ticketTriggerShadow.getPosition().z
      ),
      (this._isLocked = !1);
  }),
  (VipEntrance.prototype.update = function (t) {
    if (this._swingCountdownS > 0) {
      (this._swingCountdownS -= t),
        this._swingCountdownS <= 0 && (this._swingCountdownS = 0);
      const i = this._swingCountdownS / this.doorSwingTime;
      "open" === this._swingDirection
        ? (this.leftDoor.setLocalEulerAngles(0, 90 * (1 - i), 0),
          this.rightDoor.setLocalEulerAngles(0, 90 * -(1 - i), 0))
        : (this.leftDoor.setLocalEulerAngles(0, 90 * i, 0),
          this.rightDoor.setLocalEulerAngles(0, 90 * -i, 0));
    }
  });
var ThemeVoting = pc.createScript("themeVoting");
ThemeVoting.attributes.add("materialLeft", {
  type: "asset",
  assetType: "material",
}),
  ThemeVoting.attributes.add("materialRight", {
    type: "asset",
    assetType: "material",
  }),
  ThemeVoting.attributes.add("themeTextUi", { type: "entity" }),
  ThemeVoting.attributes.add("themeLeftText", { type: "entity" }),
  ThemeVoting.attributes.add("themeRightText", { type: "entity" }),
  ThemeVoting.attributes.add("themeLeftBg", { type: "entity" }),
  ThemeVoting.attributes.add("themeRightBg", { type: "entity" }),
  ThemeVoting.attributes.add("readyGroup", { type: "entity" }),
  ThemeVoting.attributes.add("votingGroup", { type: "entity" }),
  ThemeVoting.attributes.add("leftWaitingArea", { type: "entity" }),
  ThemeVoting.attributes.add("rightWaitingArea", { type: "entity" }),
  (ThemeVoting.prototype.initialize = function () {
    (this.app.themeVoting = this),
      (this.leftBbx = this.leftWaitingArea.script.boundingBox),
      (this.rightBbx = this.rightWaitingArea.script.boundingBox),
      (this._currentArea = ""),
      (this.selectedOffset = 0.21875),
      (this.unselectedOffset = 0.72),
      (this.baseOffset = 0.201),
      (this.selectedBg = new pc.Color(1, 0.35, 0.65)),
      (this.unselectedBg = new pc.Color(0.72, 0.64, 0.75)),
      (this.baseBg = new pc.Color(0.96, 0.84, 1)),
      (this.themeLeftBg.element.drawOrder = -400),
      (this.themeRightBg.element.drawOrder = -400),
      (this.themeLeftText.element.drawOrder = -300),
      (this.themeRightText.element.drawOrder = -300);
  }),
  (ThemeVoting.prototype.update = function (e) {
    if (FrameTracker.num % 2 == 0) {
      const e = this.app.globals.localPlayer.getPosition(),
        t = this.leftBbx.contains(e),
        i = this.rightBbx.contains(e);
      "competition:wait:left" != this._currentArea && t
        ? this.voteLeft()
        : "competition:wait:right" != this._currentArea && i
        ? this.voteRight()
        : "" == this._currentArea || t || i || this.exitVotingArea();
    }
  }),
  (ThemeVoting.prototype.voteLeft = function () {
    (this._currentArea = "competition:wait:left"),
      this.materialLeft.resource.diffuseMapOffset.set(this.selectedOffset, 0),
      this.materialRight.resource.diffuseMapOffset.set(
        this.unselectedOffset,
        0
      ),
      this.materialLeft.resource.update(),
      this.materialRight.resource.update(),
      (this.themeLeftBg.element.color = this.selectedBg),
      (this.themeRightBg.element.color = this.unselectedBg),
      (this.themeTextUi.element.text = this.themeLeftText.element.text),
      this._transmitPlayerArea();
  }),
  (ThemeVoting.prototype.voteRight = function () {
    (this._currentArea = "competition:wait:right"),
      this.materialLeft.resource.diffuseMapOffset.set(this.unselectedOffset, 0),
      this.materialRight.resource.diffuseMapOffset.set(this.selectedOffset, 0),
      (this.themeTextUi.element.text = this.themeRightText.element.text),
      (this.themeLeftBg.element.color = this.unselectedBg),
      (this.themeRightBg.element.color = this.selectedBg),
      this.materialLeft.resource.update(),
      this.materialRight.resource.update(),
      this._transmitPlayerArea();
  }),
  (ThemeVoting.prototype.exitVotingArea = function () {
    (this._currentArea = ""),
      this.materialLeft.resource.diffuseMapOffset.set(this.baseOffset, 0),
      this.materialRight.resource.diffuseMapOffset.set(this.baseOffset, 0),
      (this.themeLeftBg.element.color = this.baseBg),
      (this.themeRightBg.element.color = this.baseBg),
      this.materialLeft.resource.update(),
      this.materialRight.resource.update(),
      this.app.fire("competition:wait:exit"),
      this._transmitPlayerArea();
  }),
  (ThemeVoting.prototype.updateAndLocalizeThemes = function (e, t) {
    (this.themeLeftText.element.text = this.app.i18n.getText(
      e,
      this.app.i18n.locale
    )),
      (this.themeRightText.element.text = this.app.i18n.getText(
        t,
        this.app.i18n.locale
      ));
  }),
  (ThemeVoting.prototype.updateThemes = function (e, t) {
    (this.themeLeftText.element.text = e),
      (this.themeRightText.element.text = t);
  }),
  (ThemeVoting.prototype._transmitPlayerArea = function () {
    this.app.server.send(
      MessagePack.encode([
        this.app.networkCodes.PLAYER_AREA,
        [[[3, this._currentArea]]],
      ])
    );
  });
var ResponsiveItem = pc.createScript("responsiveItem");
ResponsiveItem.attributes.add("portrait", {
  type: "json",
  description: "Attributes to be set on the specified layout.",
  schema: [
    { name: "position", type: "vec3" },
    { name: "anchor", type: "vec4" },
    { name: "pivot", type: "vec2" },
  ],
}),
  ResponsiveItem.attributes.add("landscape", {
    type: "json",
    description: "Attributes to be set on the specified layout.",
    schema: [
      { name: "position", type: "vec3" },
      { name: "anchor", type: "vec4" },
      { name: "pivot", type: "vec2" },
    ],
  }),
  ResponsiveItem.attributes.add("landscapeMobile", {
    type: "json",
    description:
      "Optional if you want to set different attributes for mobile landscape. Otherwise will use landscape attributes.",
    schema: [
      { name: "useLandscapeMobile", type: "boolean", default: !1 },
      { name: "position", type: "vec3" },
      { name: "anchor", type: "vec4" },
      { name: "pivot", type: "vec2" },
    ],
  }),
  ResponsiveItem.attributes.add("textAlignment", {
    type: "json",
    schema: [
      { name: "useTextAlignment", type: "boolean", default: !1 },
      { name: "portrait", type: "vec2" },
      { name: "landscape", type: "vec2" },
    ],
  });
var VipRoom = pc.createScript("vipRoom");
VipRoom.attributes.add("accessMins", { type: "number", default: 30 }),
  VipRoom.attributes.add("entrances", { type: "entity", array: !0 }),
  (VipRoom.prototype.initialize = function () {
    (this.app.vipRoom = this),
      (this._vipMsRemaining = 0),
      this.app.on("vip:access:request", this._requestAccess, this),
      this.app.on("vipRoom:loaded", this._updateEntrances, this);
  }),
  (VipRoom.prototype.hasAccess = function () {
    return this._vipMsRemaining > 0;
  }),
  (VipRoom.prototype._updateEntrances = function () {
    const i = Date.now(),
      t = this.app.globals.vipGrantedAt;
    if (t && i - t < 60 * this.accessMins * 1e3) {
      let e = this.hasAccess();
      (this._vipMsRemaining = 60 * this.accessMins * 1e3 - (i - t)),
        this.hasAccess() && !e && this.app.fire("vip:access:granted");
    }
    for (let i in this.entrances) {
      let t = this.entrances[i];
      if (t.enabled) {
        let i = t.script.vipEntrance,
          e = i.timerElement;
        this.hasAccess()
          ? (i.unlock(),
            (e.element.text = window.formatTimeS(this._vipMsRemaining / 1e3)),
            (e.enabled = !0))
          : (i.lock(), (e.enabled = !1));
      }
    }
  }),
  (VipRoom.prototype._requestAccess = function () {
    this.app.fire(
      "poki:rewardedBreak:play:medium",
      function () {
        (this.app.globals.vipGrantedAt = Date.now()),
          (this._vipMsRemaining = 60 * this.accessMins * 1e3),
          this.app.saveStats("vipGrantedAt", this.app.globals.vipGrantedAt),
          this.app.fire("watcher:track", "vip_access_granted"),
          this.app.fire("vip:access:granted"),
          this._updateEntrances();
      }.bind(this),
      function () {}.bind(this)
    );
  }),
  (VipRoom.prototype.checkCollisions = function (i) {
    const t = i.getPosition();
    this.entrances.forEach(function (i) {
      let e = i.script.vipEntrance;
      i.enabled &&
        e.isUnlocked() &&
        i.script.boundingBox.contains(t) &&
        i.script.vipEntrance.openDoors();
    }, this),
      this.entrances.forEach(function (i) {
        i.enabled &&
          i.script.vipEntrance.doorsAreOpen() &&
          !i.script.boundingBox.contains(t) &&
          i.script.vipEntrance.closeDoors();
      }, this);
  }),
  (VipRoom.prototype.update = function (i) {
    if (FrameTracker.num % 25 == 0 && this._vipMsRemaining > 0) {
      const i = Date.now();
      (this._vipMsRemaining =
        60 * this.accessMins * 1e3 - (i - this.app.globals.vipGrantedAt)),
        this._vipMsRemaining <= 0
          ? (this._updateEntrances(), this.app.fire("vip:access:expired"))
          : this.entrances.forEach(function (i) {
              if (i.enabled) {
                let t = i.script.vipEntrance.timerElement;
                t &&
                  (t.element.text = window.formatTimeS(
                    this._vipMsRemaining / 1e3
                  ));
              }
            }, this);
    }
  });
var BoundingSphere = pc.createScript("boundingSphere");
(BoundingSphere.prototype.initialize = function () {
  this.entity.collision ||
    console.error(
      "BoundingSphere script requires a collision component on entity " +
        this.entity.name
    );
}),
  (BoundingSphere.prototype.contains = function (i) {
    const n = this.entity.getPosition(),
      t = this.entity.collision.radius;
    return (
      Math.sqrt(
        (i.x - n.x) * (i.x - n.x) +
          (i.y - n.y) * (i.y - n.y) +
          (i.z - n.z) * (i.z - n.z)
      ) < t
    );
  });
var TeleporterReturn = pc.createScript("teleporterReturn");
TeleporterReturn.attributes.add("playSound", { type: "boolean", default: !1 }),
  (TeleporterReturn.prototype.initialize = function () {}),
  (TeleporterReturn.prototype.teleport = function (e) {
    e.preTeleportPosition &&
      (e.setPosition(e.preTeleportPosition),
      (window.forceInstancerUpdate = !0),
      this.app.camera.snap()),
      this.playSound && this.app.fire("teleportSound");
  });
var CustomPoseObject = pc.createScript("customPoseObject");
CustomPoseObject.attributes.add("poseNum", {
  type: "number",
  description: "This number corresponds to the number in the animStateGraph.",
}),
  CustomPoseObject.attributes.add("playerLocationOffset", {
    type: "vec3",
    default: [0, 0, 0],
    description: "Location offset for the player.",
  }),
  CustomPoseObject.attributes.add("playerRotation", {
    type: "vec3",
    default: [0, 0, 0],
    description: "Rotation offset for the player.",
  }),
  (CustomPoseObject.prototype.initialize = function () {
    this.entity.collision ||
      console.warn(
        "CustomPoseObject needs a collision box: " + this.entity.name
      ),
      (this.boundingBox = this.entity.script.boundingBox),
      (this.poseActive = !1),
      (this.inBBox = !1),
      this.app.on(
        "poki:firstInteraction",
        function () {
          this.poseActive && this.deactivatePose();
        },
        this
      );
  }),
  (CustomPoseObject.prototype.update = function (t) {
    if (FrameTracker.num % 10 == 0) {
      const t = this.app.globals.localPlayer.getPosition();
      !this.boundingBox.contains(t) ||
      this.inBBox ||
      this.poseActive ||
      "broom" == this.app.globals.localOutfit.selection.handhelds.selected
        ? this.boundingBox.contains(t) || (this.inBBox = !1)
        : (this.activatePose(t), (this.inBBox = !0));
    }
  }),
  (CustomPoseObject.prototype.activatePose = function (t) {
    (this.app.globals.movementAllowed = !1), (this.poseActive = !0);
    const e = this.entity.getPosition();
    this.app.globals.localCharAnims.setPose(this.poseNum),
      this.app.globals.localPlayer.setLocalPosition(
        e.x + this.playerLocationOffset.x,
        e.y + this.playerLocationOffset.y,
        e.z + this.playerLocationOffset.z
      ),
      this.app.globals.localPlayer.setEulerAngles(
        this.playerRotation.x,
        this.playerRotation.y,
        this.playerRotation.z
      );
    const o = [
      this.app.networkCodes.COMMUNICATION,
      [
        [
          [1, 2],
          [1, this.poseNum],
        ],
      ],
    ];
    this.app.server.send(MessagePack.encode(o));
  }),
  (CustomPoseObject.prototype.deactivatePose = function () {
    this.app.globals.keyboardMovementBlocked ||
      ((this.app.globals.movementAllowed = !0),
      (this.poseActive = !1),
      this.app.globals.localCharAnims.setAnimIdle());
  });
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(require("playcanvas"))
    : "function" == typeof define && define.amd
    ? define(["playcanvas"], e)
    : e((t = "undefined" != typeof globalThis ? globalThis : t || self).pc);
})(this, function (t) {
  "use strict";
  const Linear = function (t) {
      return t;
    },
    BounceOut = function (t) {
      return t < 1 / 2.75
        ? 7.5625 * t * t
        : t < 2 / 2.75
        ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
        : t < 2.5 / 2.75
        ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
        : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    BounceIn = function (t) {
      return 1 - BounceOut(1 - t);
    };
  var e = Object.freeze({
    __proto__: null,
    BackIn: function (t) {
      const e = 1.70158;
      return t * t * ((e + 1) * t - e);
    },
    BackInOut: function (t) {
      const e = 2.5949095;
      return (t *= 2) < 1
        ? t * t * ((e + 1) * t - e) * 0.5
        : 0.5 * ((t -= 2) * t * ((e + 1) * t + e) + 2);
    },
    BackOut: function (t) {
      const e = 1.70158;
      return --t * t * ((e + 1) * t + e) + 1;
    },
    BounceIn: BounceIn,
    BounceInOut: function (t) {
      return t < 0.5 ? 0.5 * BounceIn(2 * t) : 0.5 * BounceOut(2 * t - 1) + 0.5;
    },
    BounceOut: BounceOut,
    CircularIn: function (t) {
      return 1 - Math.sqrt(1 - t * t);
    },
    CircularInOut: function (t) {
      return (t *= 2) < 1
        ? -0.5 * (Math.sqrt(1 - t * t) - 1)
        : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    CircularOut: function (t) {
      return Math.sqrt(1 - --t * t);
    },
    CubicIn: function (t) {
      return t * t * t;
    },
    CubicInOut: function (t) {
      return (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
    },
    CubicOut: function (t) {
      return --t * t * t + 1;
    },
    ElasticIn: function (t) {
      let e,
        i = 0.1;
      return 0 === t
        ? 0
        : 1 === t
        ? 1
        : (!i || i < 1
            ? ((i = 1), (e = 0.1))
            : (e = (0.4 * Math.asin(1 / i)) / (2 * Math.PI)),
          -i *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t - e) * (2 * Math.PI)) / 0.4));
    },
    ElasticInOut: function (t) {
      const e = 0.4;
      let i,
        s = 0.1;
      return 0 === t
        ? 0
        : 1 === t
        ? 1
        : (!s || s < 1
            ? ((s = 1), (i = 0.1))
            : (i = (e * Math.asin(1 / s)) / (2 * Math.PI)),
          (t *= 2) < 1
            ? s *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t - i) * (2 * Math.PI)) / e) *
              -0.5
            : s *
                Math.pow(2, -10 * (t -= 1)) *
                Math.sin(((t - i) * (2 * Math.PI)) / e) *
                0.5 +
              1);
    },
    ElasticOut: function (t) {
      let e,
        i = 0.1;
      return 0 === t
        ? 0
        : 1 === t
        ? 1
        : (!i || i < 1
            ? ((i = 1), (e = 0.1))
            : (e = (0.4 * Math.asin(1 / i)) / (2 * Math.PI)),
          i * Math.pow(2, -10 * t) * Math.sin(((t - e) * (2 * Math.PI)) / 0.4) +
            1);
    },
    ExponentialIn: function (t) {
      return 0 === t ? 0 : Math.pow(1024, t - 1);
    },
    ExponentialInOut: function (t) {
      return 0 === t
        ? 0
        : 1 === t
        ? 1
        : (t *= 2) < 1
        ? 0.5 * Math.pow(1024, t - 1)
        : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
    },
    ExponentialOut: function (t) {
      return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
    },
    Linear: Linear,
    QuadraticIn: function (t) {
      return t * t;
    },
    QuadraticInOut: function (t) {
      return (t *= 2) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
    },
    QuadraticOut: function (t) {
      return t * (2 - t);
    },
    QuarticIn: function (t) {
      return t * t * t * t;
    },
    QuarticInOut: function (t) {
      return (t *= 2) < 1
        ? 0.5 * t * t * t * t
        : -0.5 * ((t -= 2) * t * t * t - 2);
    },
    QuarticOut: function (t) {
      return 1 - --t * t * t * t;
    },
    QuinticIn: function (t) {
      return t * t * t * t * t;
    },
    QuinticInOut: function (t) {
      return (t *= 2) < 1
        ? 0.5 * t * t * t * t * t
        : 0.5 * ((t -= 2) * t * t * t * t + 2);
    },
    QuinticOut: function (t) {
      return --t * t * t * t * t + 1;
    },
    SineIn: function (t) {
      return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos((t * Math.PI) / 2);
    },
    SineInOut: function (t) {
      return 0 === t ? 0 : 1 === t ? 1 : 0.5 * (1 - Math.cos(Math.PI * t));
    },
    SineOut: function (t) {
      return 0 === t ? 0 : 1 === t ? 1 : Math.sin((t * Math.PI) / 2);
    },
  });
  class TweenManager {
    _tweens = [];
    _add = [];
    add(t) {
      return this._add.push(t), t;
    }
    update(t) {
      let e = 0,
        i = this._tweens.length;
      for (; e < i; )
        this._tweens[e].update(t) ? e++ : (this._tweens.splice(e, 1), i--);
      if (this._add.length) {
        for (let t = 0; t < this._add.length; t++)
          this._tweens.indexOf(this._add[t]) > -1 ||
            this._tweens.push(this._add[t]);
        this._add.length = 0;
      }
    }
  }
  class Tween extends t.EventHandler {
    constructor(e, i, s) {
      super(),
        (this.manager = i),
        s && (this.entity = null),
        (this.time = 0),
        (this.complete = !1),
        (this.playing = !1),
        (this.stopped = !0),
        (this.pending = !1),
        (this.target = e),
        (this.duration = 0),
        (this._currentDelay = 0),
        (this.timeScale = 1),
        (this._reverse = !1),
        (this._delay = 0),
        (this._yoyo = !1),
        (this._count = 0),
        (this._numRepeats = 0),
        (this._repeatDelay = 0),
        (this._from = !1),
        (this._slerp = !1),
        (this._fromQuat = new t.Quat()),
        (this._toQuat = new t.Quat()),
        (this._quat = new t.Quat()),
        (this.easing = Linear),
        (this._sv = {}),
        (this._ev = {});
    }
    _parseProperties(e) {
      let i;
      return (
        e instanceof t.Vec2
          ? (i = { x: e.x, y: e.y })
          : e instanceof t.Vec3
          ? (i = { x: e.x, y: e.y, z: e.z })
          : e instanceof t.Vec4 || e instanceof t.Quat
          ? (i = { x: e.x, y: e.y, z: e.z, w: e.w })
          : e instanceof t.Color
          ? ((i = { r: e.r, g: e.g, b: e.b }), void 0 !== e.a && (i.a = e.a))
          : (i = e),
        i
      );
    }
    to(t, e, i, s, n, r) {
      return (
        (this._properties = this._parseProperties(t)),
        (this.duration = e),
        i && (this.easing = i),
        s && this.delay(s),
        n && this.repeat(n),
        r && this.yoyo(r),
        this
      );
    }
    from(t, e, i, s, n, r) {
      return (
        (this._properties = this._parseProperties(t)),
        (this.duration = e),
        i && (this.easing = i),
        s && this.delay(s),
        n && this.repeat(n),
        r && this.yoyo(r),
        (this._from = !0),
        this
      );
    }
    rotate(t, e, i, s, n, r) {
      return (
        (this._properties = this._parseProperties(t)),
        (this.duration = e),
        i && (this.easing = i),
        s && this.delay(s),
        n && this.repeat(n),
        r && this.yoyo(r),
        (this._slerp = !0),
        this
      );
    }
    start() {
      let t, e, i, s;
      if (
        ((this.playing = !0),
        (this.complete = !1),
        (this.stopped = !1),
        (this._count = 0),
        (this.pending = this._delay > 0),
        this._reverse && !this.pending
          ? (this.time = this.duration)
          : (this.time = 0),
        this._from)
      ) {
        for (t in this._properties)
          this._properties.hasOwnProperty(t) &&
            ((this._sv[t] = this._properties[t]),
            (this._ev[t] = this.target[t]));
        this._slerp &&
          (this._toQuat.setFromEulerAngles(
            this.target.x,
            this.target.y,
            this.target.z
          ),
          (e =
            void 0 !== this._properties.x ? this._properties.x : this.target.x),
          (i =
            void 0 !== this._properties.y ? this._properties.y : this.target.y),
          (s =
            void 0 !== this._properties.z ? this._properties.z : this.target.z),
          this._fromQuat.setFromEulerAngles(e, i, s));
      } else {
        for (t in this._properties)
          this._properties.hasOwnProperty(t) &&
            ((this._sv[t] = this.target[t]),
            (this._ev[t] = this._properties[t]));
        this._slerp &&
          ((e =
            void 0 !== this._properties.x ? this._properties.x : this.target.x),
          (i =
            void 0 !== this._properties.y ? this._properties.y : this.target.y),
          (s =
            void 0 !== this._properties.z ? this._properties.z : this.target.z),
          void 0 !== this._properties.w
            ? (this._fromQuat.copy(this.target),
              this._toQuat.set(e, i, s, this._properties.w))
            : (this._fromQuat.setFromEulerAngles(
                this.target.x,
                this.target.y,
                this.target.z
              ),
              this._toQuat.setFromEulerAngles(e, i, s)));
      }
      return (this._currentDelay = this._delay), this.manager.add(this), this;
    }
    pause() {
      this.playing = !1;
    }
    resume() {
      this.playing = !0;
    }
    stop() {
      (this.playing = !1), (this.stopped = !0);
    }
    delay(t) {
      return (this._delay = t), (this.pending = !0), this;
    }
    repeat(t, e) {
      return (
        (this._count = 0),
        (this._numRepeats = t),
        (this._repeatDelay = e || 0),
        this
      );
    }
    loop(t) {
      return (
        t
          ? ((this._count = 0), (this._numRepeats = 1 / 0))
          : (this._numRepeats = 0),
        this
      );
    }
    yoyo(t) {
      return (this._yoyo = t), this;
    }
    reverse() {
      return (this._reverse = !this._reverse), this;
    }
    chain() {
      let t = arguments.length;
      for (; t--; )
        t > 0
          ? (arguments[t - 1]._chained = arguments[t])
          : (this._chained = arguments[t]);
      return this;
    }
    onUpdate(t) {
      return this.on("update", t), this;
    }
    onComplete(t) {
      return this.on("complete", t), this;
    }
    onLoop(t) {
      return this.on("loop", t), this;
    }
    update(t) {
      if (this.stopped) return !1;
      if (!this.playing) return !0;
      if (
        (!this._reverse || this.pending
          ? (this.time += t * this.timeScale)
          : (this.time -= t * this.timeScale),
        this.pending)
      ) {
        if (!(this.time > this._currentDelay)) return !0;
        this._reverse
          ? (this.time = this.duration - (this.time - this._currentDelay))
          : (this.time -= this._currentDelay),
          (this.pending = !1);
      }
      let e = 0;
      ((!this._reverse && this.time > this.duration) ||
        (this._reverse && this.time < 0)) &&
        (this._count++,
        (this.complete = !0),
        (this.playing = !1),
        this._reverse
          ? ((e = this.duration - this.time), (this.time = 0))
          : ((e = this.time - this.duration), (this.time = this.duration)));
      const i = 0 === this.duration ? 1 : this.time / this.duration,
        s = this.easing(i);
      let n, r;
      for (const t in this._properties)
        this._properties.hasOwnProperty(t) &&
          ((n = this._sv[t]),
          (r = this._ev[t]),
          (this.target[t] = n + (r - n) * s));
      if (
        (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, s),
        this.entity &&
          (this.entity._dirtifyLocal(),
          this.element &&
            this.entity.element &&
            (this.entity.element[this.element] = this.target),
          this._slerp && this.entity.setLocalRotation(this._quat)),
        this.fire("update", t),
        this.complete)
      ) {
        const t = this._repeat(e);
        return (
          t
            ? this.fire("loop")
            : (this.fire("complete", e),
              this.entity && this.entity.off("destroy", this.stop, this),
              this._chained && this._chained.start()),
          t
        );
      }
      return !0;
    }
    _repeat(t) {
      if (this._count < this._numRepeats) {
        if (
          (this._reverse ? (this.time = this.duration - t) : (this.time = t),
          (this.complete = !1),
          (this.playing = !0),
          (this._currentDelay = this._repeatDelay),
          (this.pending = !0),
          this._yoyo)
        ) {
          for (const t in this._properties) {
            const e = this._sv[t];
            (this._sv[t] = this._ev[t]), (this._ev[t] = e);
          }
          this._slerp &&
            (this._quat.copy(this._fromQuat),
            this._fromQuat.copy(this._toQuat),
            this._toQuat.copy(this._quat));
        }
        return !0;
      }
      return !1;
    }
  }
  const i = new Map(),
    getTweenManager = (e) => {
      if (!(e && e instanceof t.AppBase))
        throw new Error("`getTweenManager` expects an instance of `AppBase`");
      if (!i.has(e)) {
        const t = new TweenManager();
        i.set(e, t),
          e.on("update", (e) => {
            t.update(e);
          }),
          e.on("destroy", () => i.delete(e));
      }
      return i.get(e);
    };
  if (!globalThis.pc)
    throw new Error("There is no global `pc` playcanvas object.");
  Object.assign(globalThis.pc, e),
    (({ AppBase: t, Entity: e }) => {
      if (!t)
        throw new Error(
          "The param `addExtensions` must contain the `AppBase` class. `addExtensions({ AppBase })`"
        );
      if (!e)
        throw new Error(
          "The param `addExtensions` must contain the `Entity` class. `addExtensions({ Entity })`"
        );
      (t.prototype.tween = function (t) {
        const e = getTweenManager(this);
        return new Tween(t, e);
      }),
        (e.prototype.tween = function (t, e) {
          return ((t, e, i) => {
            const s = getTweenManager(t._app),
              n = new Tween(e, s);
            return (
              (n.entity = t),
              t.once("destroy", n.stop, n),
              i && i.element && (n.element = i.element),
              n
            );
          })(this, t, e);
        });
    })(globalThis.pc),
    (globalThis.pc.AppBase.prototype.addTweenManager = function () {
      this._tweenManager = getTweenManager(this);
    });
});
var WorldButtonMarker = pc.createScript("worldButtonMarker");
WorldButtonMarker.attributes.add("activationDistance", {
  type: "number",
  default: 2,
  description: "Distance from the player at which the button will be shown",
}),
  WorldButtonMarker.attributes.add("buttonText", {
    type: "string",
    default: "Tap",
    description: "Text to display on the button",
  }),
  (WorldButtonMarker.prototype.initialize = function () {
    (this._isDisabled = !1), (this._isBlocked = !1);
  }),
  (WorldButtonMarker.prototype.disable = function () {
    this._isDisabled = !0;
  }),
  (WorldButtonMarker.prototype.resetDisabled = function () {
    this._isDisabled = !1;
  }),
  (WorldButtonMarker.prototype.isDisabled = function () {
    return this._isDisabled;
  }),
  (WorldButtonMarker.prototype.isBlocked = function () {
    return this._isBlocked;
  }),
  (WorldButtonMarker.prototype.setBlocked = function (t) {
    this._isBlocked = t;
  }),
  (WorldButtonMarker.prototype.updateText = function (t) {
    (this.buttonText = t), this.fire("text:updated", this.buttonText);
  });
var SuggestionBox = pc.createScript("suggestionBox");
SuggestionBox.attributes.add("lid", { type: "entity" }),
  SuggestionBox.attributes.add("lidOpenCurve", { type: "curve" }),
  SuggestionBox.attributes.add("lidCloseCurve", { type: "curve" }),
  SuggestionBox.attributes.add("lidOpenTime", { type: "number", default: 1 }),
  SuggestionBox.attributes.add("worldButtonMarker", { type: "entity" }),
  SuggestionBox.attributes.add("sparkles", { type: "entity" }),
  (SuggestionBox.prototype.initialize = function () {
    (this._lidCountdownS = 0),
      (this._lidDirection = ""),
      window.setVDynamic(this.lid, !0),
      (this.markerScript = this.worldButtonMarker.script.worldButtonMarker),
      this.markerScript.on("marker:show", this.open, this),
      this.markerScript.on("marker:hide", this.close, this),
      this.markerScript.on("button:clicked", this._openForm, this),
      this.app.on("suggestion:submitted", this._onFormSubmitted, this);
  }),
  (SuggestionBox.prototype.open = function () {
    (this._lidDirection = "open"), (this._lidCountdownS = this.lidOpenTime);
  }),
  (SuggestionBox.prototype.close = function () {
    (this._lidCountdownS = this.lidOpenTime),
      (this._lidDirection = "close"),
      this._closeForm();
  }),
  (SuggestionBox.prototype.update = function (t) {
    let i = this._lidCountdownS;
    if (i > 0) {
      (i -= t), i < 0 && (i = 0);
      let e = 1 - i / this.lidOpenTime,
        o = (
          "open" === this._lidDirection ? this.lidOpenCurve : this.lidCloseCurve
        ).value(e);
      this.lid.setLocalEulerAngles(0, 0, o), (this._lidCountdownS = i);
    }
  }),
  (SuggestionBox.prototype._openForm = function () {
    this.app.screenSystem.openScreen("suggestions");
  }),
  (SuggestionBox.prototype._closeForm = function () {
    this.app.screenSystem.closeScreen("suggestions");
  }),
  (SuggestionBox.prototype._onFormSubmitted = function () {
    this.sparkles.particlesystem.play(),
      setTimeout(
        function () {
          this.sparkles.particlesystem.stop(),
            this.sparkles.particlesystem.reset();
        }.bind(this),
        250
      );
  });
var PlayerButtonMarker = pc.createScript("playerButtonMarker");
PlayerButtonMarker.attributes.add("buttonEntity", {
  type: "entity",
  description: "The button entity that will be shown when the player is near",
}),
  PlayerButtonMarker.attributes.add("buttonText", {
    type: "string",
    default: "Tap",
    description: "Text to display on the button",
  }),
  (PlayerButtonMarker.prototype.initialize = function () {
    (this._isVisible = !1),
      (this._screenPos = new pc.Vec3()),
      (this._isDisabled = !1),
      (this._targetPlayer = null),
      this.buttonEntity.button.on(
        "click",
        function () {
          this.buttonEntity.script.pulse.start(),
            this.entity.fire("button:clicked");
        },
        this
      );
  }),
  (PlayerButtonMarker.prototype.isVisible = function () {
    return this._isVisible;
  }),
  (PlayerButtonMarker.prototype.show = function (t) {
    this._isVisible ||
      ((this._isVisible = !0),
      (this.buttonEntity.findByName("Text").element.text =
        this.app.i18n.getText(this.buttonText, this.app.i18n.locale)),
      this.buttonEntity.script.pulse.start(),
      (this._targetPlayer = t),
      this.update(0),
      (this.buttonEntity.enabled = !0));
  }),
  (PlayerButtonMarker.prototype.hide = function () {
    this._isVisible &&
      ((this._isVisible = !1), (this.buttonEntity.enabled = !1));
  }),
  (PlayerButtonMarker.prototype.disable = function () {
    this._isDisabled = !0;
  }),
  (PlayerButtonMarker.prototype.resetDisabled = function () {
    this._isDisabled = !1;
  }),
  (PlayerButtonMarker.prototype.isDisabled = function () {
    return this._isDisabled;
  }),
  (PlayerButtonMarker.prototype.update = function (t) {
    if (!this._isVisible || !this._targetPlayer) return;
    let i = this._screenPos;
    const e = this._targetPlayer.getPosition();
    if (
      ((e.y += 1.35),
      this.app.camera.entity.camera.worldToScreen(e, i),
      i.z > 0)
    ) {
      const t = this.app.graphicsDevice.maxPixelRatio;
      (i.x *= t), (i.y *= t);
      const e = this.app.graphicsDevice;
      this.buttonEntity.setPosition(
        (i.x / e.width) * 2 - 1,
        2 * (1 - i.y / e.height) - 1,
        0
      );
    } else this.buttonEntity.enabled = !1;
  });
var DanceFloor = pc.createScript("danceFloor");
DanceFloor.attributes.add("tiles", { type: "entity", array: !0 }),
  DanceFloor.attributes.add("tileColors", {
    type: "asset",
    assetType: "render",
    array: !0,
  }),
  (DanceFloor.prototype.initialize = function () {
    (this._playersOnDanceFloor = []), (this._playerTileStates = []);
    for (let e = 0; e < this.tiles.length; e++)
      window.setVDynamic(this.tiles[e], !0),
        this._playerTileStates.push({ hasPlayers: !1, wasChecked: !1 });
    (this._boundingBox = new pc.BoundingBox()),
      (this._boundingBox.center = this.entity
        .getPosition()
        .add(this.entity.collision.linearOffset)),
      (this._boundingBox.halfExtents = this.entity.collision.halfExtents),
      (this._boundingBoxMin = this._boundingBox.getMin()),
      (this._boundingBoxMax = this._boundingBox.getMax());
  }),
  (DanceFloor.prototype.update = function (e) {
    FrameTracker.num % 20 == 0 && this._updatePlayersOnDanceFloor(),
      FrameTracker.num % 4 == 0 && this._updatePlayerTiles();
  }),
  (DanceFloor.prototype._updatePlayersOnDanceFloor = function () {
    this._checkExistingPlayers(), this._checkForNewPlayers();
  }),
  (DanceFloor.prototype._checkExistingPlayers = function () {
    for (let e = this._playersOnDanceFloor.length - 1; e >= 0; e--) {
      const t = this._playersOnDanceFloor[e].getPosition();
      (t.x <= this._boundingBoxMin.x ||
        t.x >= this._boundingBoxMax.x ||
        t.z <= this._boundingBoxMin.z ||
        t.z >= this._boundingBoxMax.z) &&
        this._playersOnDanceFloor.splice(e, 1);
    }
  }),
  (DanceFloor.prototype._checkForNewPlayers = function () {
    const e = this._boundingBoxMin,
      t = this._boundingBoxMax,
      o = this.app.globals.localPlayer.getPosition();
    o.x > e.x &&
      o.x < t.x &&
      o.z > e.z &&
      o.z < t.z &&
      this._addToPlayersOnDanceFloor(this.app.globals.localPlayer);
    for (const o in this.app.remotePlayers) {
      const n = this.app.remotePlayers[o].getPosition();
      n.x > e.x &&
        n.x < t.x &&
        n.z > e.z &&
        n.z < t.z &&
        this._addToPlayersOnDanceFloor(this.app.remotePlayers[o]);
    }
  }),
  (DanceFloor.prototype._addToPlayersOnDanceFloor = function (e) {
    for (let t = 0; t < this._playersOnDanceFloor.length; t++) {
      const o = this._playersOnDanceFloor[t];
      if (e.clientId == o.clientId) return;
    }
    this._playersOnDanceFloor.push(e);
  }),
  (DanceFloor.prototype._updatePlayerTiles = function () {
    let e = this._playerTileStates;
    for (let t = this._playersOnDanceFloor.length - 1; t >= 0; t--) {
      const o = this._playersOnDanceFloor[t];
      if (!o || o.hasLeftGame) {
        this._playersOnDanceFloor.splice(t, 1);
        continue;
      }
      const n = this._getTileIndex(o.getPosition()),
        i = this.tiles[n];
      if (((e[n].wasChecked = !0), !e[n].hasPlayers)) {
        const t = 1 + Math.floor(Math.random() * (this.tileColors.length - 1));
        (i.render.asset = this.tileColors[t]), (e[n].hasPlayers = !0);
      }
    }
    for (let t in e)
      e[t].hasPlayers &&
        !e[t].wasChecked &&
        ((this.tiles[t].render.asset = this.tileColors[0]),
        (e[t].hasPlayers = !1)),
        (e[t].wasChecked = !1);
    this._playerTileStates = e;
  }),
  (DanceFloor.prototype._getTileIndex = function (e) {
    let t = Math.floor((e.x - this._boundingBoxMin.x) / 2.9),
      o = Math.floor((e.z - this._boundingBoxMin.z) / 2.9);
    t < 0 ? (t = 0) : t >= 4 && (t = 3), o < 0 ? (o = 0) : o >= 4 && (o = 3);
    let n = 4 * o + t;
    return (
      n < 0 ? (n = 0) : n >= this.tiles.length && (n = this.tiles.length - 1), n
    );
  });
pc.extend(
  pc,
  (function () {
    var TweenManager = function (t) {
      (this._app = t), (this._tweens = []), (this._add = []);
    };
    TweenManager.prototype = {
      add: function (t) {
        return this._add.push(t), t;
      },
      update: function (t) {
        for (var i = 0, e = this._tweens.length; i < e; )
          this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1), e--);
        if (this._add.length) {
          for (let t = 0; t < this._add.length; t++)
            this._tweens.indexOf(this._add[t]) > -1 ||
              this._tweens.push(this._add[t]);
          this._add.length = 0;
        }
      },
    };
    var Tween = function (t, i, e) {
        pc.events.attach(this),
          (this.manager = i),
          e && (this.entity = null),
          (this.time = 0),
          (this.complete = !1),
          (this.playing = !1),
          (this.stopped = !0),
          (this.pending = !1),
          (this.target = t),
          (this.duration = 0),
          (this._currentDelay = 0),
          (this.timeScale = 1),
          (this._reverse = !1),
          (this._delay = 0),
          (this._yoyo = !1),
          (this._count = 0),
          (this._numRepeats = 0),
          (this._repeatDelay = 0),
          (this._from = !1),
          (this._slerp = !1),
          (this._fromQuat = new pc.Quat()),
          (this._toQuat = new pc.Quat()),
          (this._quat = new pc.Quat()),
          (this.easing = pc.Linear),
          (this._sv = {}),
          (this._ev = {});
      },
      _parseProperties = function (t) {
        var i;
        return (
          t instanceof pc.Vec2
            ? (i = { x: t.x, y: t.y })
            : t instanceof pc.Vec3
            ? (i = { x: t.x, y: t.y, z: t.z })
            : t instanceof pc.Vec4 || t instanceof pc.Quat
            ? (i = { x: t.x, y: t.y, z: t.z, w: t.w })
            : t instanceof pc.Color
            ? ((i = { r: t.r, g: t.g, b: t.b }), void 0 !== t.a && (i.a = t.a))
            : (i = t),
          i
        );
      };
    Tween.prototype = {
      to: function (t, i, e, s, n, r) {
        return (
          (this._properties = _parseProperties(t)),
          (this.duration = i),
          e && (this.easing = e),
          s && this.delay(s),
          n && this.repeat(n),
          r && this.yoyo(r),
          this
        );
      },
      from: function (t, i, e, s, n, r) {
        return (
          (this._properties = _parseProperties(t)),
          (this.duration = i),
          e && (this.easing = e),
          s && this.delay(s),
          n && this.repeat(n),
          r && this.yoyo(r),
          (this._from = !0),
          this
        );
      },
      rotate: function (t, i, e, s, n, r) {
        return (
          (this._properties = _parseProperties(t)),
          (this.duration = i),
          e && (this.easing = e),
          s && this.delay(s),
          n && this.repeat(n),
          r && this.yoyo(r),
          (this._slerp = !0),
          this
        );
      },
      start: function () {
        var t, i, e, s;
        if (
          ((this.playing = !0),
          (this.complete = !1),
          (this.stopped = !1),
          (this._count = 0),
          (this.pending = this._delay > 0),
          this._reverse && !this.pending
            ? (this.time = this.duration)
            : (this.time = 0),
          this._from)
        ) {
          for (t in this._properties)
            this._properties.hasOwnProperty(t) &&
              ((this._sv[t] = this._properties[t]),
              (this._ev[t] = this.target[t]));
          this._slerp &&
            (this._toQuat.setFromEulerAngles(
              this.target.x,
              this.target.y,
              this.target.z
            ),
            (i =
              void 0 !== this._properties.x
                ? this._properties.x
                : this.target.x),
            (e =
              void 0 !== this._properties.y
                ? this._properties.y
                : this.target.y),
            (s =
              void 0 !== this._properties.z
                ? this._properties.z
                : this.target.z),
            this._fromQuat.setFromEulerAngles(i, e, s));
        } else {
          for (t in this._properties)
            this._properties.hasOwnProperty(t) &&
              ((this._sv[t] = this.target[t]),
              (this._ev[t] = this._properties[t]));
          this._slerp &&
            ((i =
              void 0 !== this._properties.x
                ? this._properties.x
                : this.target.x),
            (e =
              void 0 !== this._properties.y
                ? this._properties.y
                : this.target.y),
            (s =
              void 0 !== this._properties.z
                ? this._properties.z
                : this.target.z),
            void 0 !== this._properties.w
              ? (this._fromQuat.copy(this.target),
                this._toQuat.set(i, e, s, this._properties.w))
              : (this._fromQuat.setFromEulerAngles(
                  this.target.x,
                  this.target.y,
                  this.target.z
                ),
                this._toQuat.setFromEulerAngles(i, e, s)));
        }
        return (this._currentDelay = this._delay), this.manager.add(this), this;
      },
      pause: function () {
        this.playing = !1;
      },
      resume: function () {
        this.playing = !0;
      },
      stop: function () {
        (this.playing = !1), (this.stopped = !0);
      },
      delay: function (t) {
        return (this._delay = t), (this.pending = !0), this;
      },
      repeat: function (t, i) {
        return (
          (this._count = 0),
          (this._numRepeats = t),
          (this._repeatDelay = i || 0),
          this
        );
      },
      loop: function (t) {
        return (
          t
            ? ((this._count = 0), (this._numRepeats = 1 / 0))
            : (this._numRepeats = 0),
          this
        );
      },
      yoyo: function (t) {
        return (this._yoyo = t), this;
      },
      reverse: function () {
        return (this._reverse = !this._reverse), this;
      },
      chain: function () {
        for (var t = arguments.length; t--; )
          t > 0
            ? (arguments[t - 1]._chained = arguments[t])
            : (this._chained = arguments[t]);
        return this;
      },
      update: function (t) {
        if (this.stopped) return !1;
        if (!this.playing) return !0;
        if (
          (!this._reverse || this.pending
            ? (this.time += t * this.timeScale)
            : (this.time -= t * this.timeScale),
          this.pending)
        ) {
          if (!(this.time > this._currentDelay)) return !0;
          this._reverse
            ? (this.time = this.duration - (this.time - this._currentDelay))
            : (this.time -= this._currentDelay),
            (this.pending = !1);
        }
        var i = 0;
        ((!this._reverse && this.time > this.duration) ||
          (this._reverse && this.time < 0)) &&
          (this._count++,
          (this.complete = !0),
          (this.playing = !1),
          this._reverse
            ? ((i = this.duration - this.time), (this.time = 0))
            : ((i = this.time - this.duration), (this.time = this.duration)));
        var e,
          s,
          n = 0 === this.duration ? 1 : this.time / this.duration,
          r = this.easing(n);
        for (var h in this._properties)
          this._properties.hasOwnProperty(h) &&
            ((e = this._sv[h]),
            (s = this._ev[h]),
            (this.target[h] = e + (s - e) * r));
        if (
          (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r),
          this.entity &&
            (this.entity._dirtifyLocal(),
            this.element &&
              this.entity.element &&
              (this.entity.element[this.element] = this.target),
            this._slerp && this.entity.setLocalRotation(this._quat)),
          this.fire("update", t),
          this.complete)
        ) {
          var a = this._repeat(i);
          return (
            a
              ? this.fire("loop")
              : (this.fire("complete", i),
                this.entity && this.entity.off("destroy", this.stop, this),
                this._chained && this._chained.start()),
            a
          );
        }
        return !0;
      },
      _repeat: function (t) {
        if (this._count < this._numRepeats) {
          if (
            (this._reverse ? (this.time = this.duration - t) : (this.time = t),
            (this.complete = !1),
            (this.playing = !0),
            (this._currentDelay = this._repeatDelay),
            (this.pending = !0),
            this._yoyo)
          ) {
            for (var i in this._properties) {
              var e = this._sv[i];
              (this._sv[i] = this._ev[i]), (this._ev[i] = e);
            }
            this._slerp &&
              (this._quat.copy(this._fromQuat),
              this._fromQuat.copy(this._toQuat),
              this._toQuat.copy(this._quat));
          }
          return !0;
        }
        return !1;
      },
    };
    var BounceOut = function (t) {
        return t < 1 / 2.75
          ? 7.5625 * t * t
          : t < 2 / 2.75
          ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
          : t < 2.5 / 2.75
          ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
          : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      },
      BounceIn = function (t) {
        return 1 - BounceOut(1 - t);
      };
    return {
      TweenManager: TweenManager,
      Tween: Tween,
      Linear: function (t) {
        return t;
      },
      QuadraticIn: function (t) {
        return t * t;
      },
      QuadraticOut: function (t) {
        return t * (2 - t);
      },
      QuadraticInOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
      },
      CubicIn: function (t) {
        return t * t * t;
      },
      CubicOut: function (t) {
        return --t * t * t + 1;
      },
      CubicInOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
      },
      QuarticIn: function (t) {
        return t * t * t * t;
      },
      QuarticOut: function (t) {
        return 1 - --t * t * t * t;
      },
      QuarticInOut: function (t) {
        return (t *= 2) < 1
          ? 0.5 * t * t * t * t
          : -0.5 * ((t -= 2) * t * t * t - 2);
      },
      QuinticIn: function (t) {
        return t * t * t * t * t;
      },
      QuinticOut: function (t) {
        return --t * t * t * t * t + 1;
      },
      QuinticInOut: function (t) {
        return (t *= 2) < 1
          ? 0.5 * t * t * t * t * t
          : 0.5 * ((t -= 2) * t * t * t * t + 2);
      },
      SineIn: function (t) {
        return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos((t * Math.PI) / 2);
      },
      SineOut: function (t) {
        return 0 === t ? 0 : 1 === t ? 1 : Math.sin((t * Math.PI) / 2);
      },
      SineInOut: function (t) {
        return 0 === t ? 0 : 1 === t ? 1 : 0.5 * (1 - Math.cos(Math.PI * t));
      },
      ExponentialIn: function (t) {
        return 0 === t ? 0 : Math.pow(1024, t - 1);
      },
      ExponentialOut: function (t) {
        return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
      },
      ExponentialInOut: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (t *= 2) < 1
          ? 0.5 * Math.pow(1024, t - 1)
          : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
      },
      CircularIn: function (t) {
        return 1 - Math.sqrt(1 - t * t);
      },
      CircularOut: function (t) {
        return Math.sqrt(1 - --t * t);
      },
      CircularInOut: function (t) {
        return (t *= 2) < 1
          ? -0.5 * (Math.sqrt(1 - t * t) - 1)
          : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
      },
      BackIn: function (t) {
        var i = 1.70158;
        return t * t * ((i + 1) * t - i);
      },
      BackOut: function (t) {
        var i = 1.70158;
        return --t * t * ((i + 1) * t + i) + 1;
      },
      BackInOut: function (t) {
        var i = 2.5949095;
        return (t *= 2) < 1
          ? t * t * ((i + 1) * t - i) * 0.5
          : 0.5 * ((t -= 2) * t * ((i + 1) * t + i) + 2);
      },
      BounceIn: BounceIn,
      BounceOut: BounceOut,
      BounceInOut: function (t) {
        return t < 0.5
          ? 0.5 * BounceIn(2 * t)
          : 0.5 * BounceOut(2 * t - 1) + 0.5;
      },
      ElasticIn: function (t) {
        var i,
          e = 0.1;
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (!e || e < 1
              ? ((e = 1), (i = 0.1))
              : (i = (0.4 * Math.asin(1 / e)) / (2 * Math.PI)),
            -e *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t - i) * (2 * Math.PI)) / 0.4));
      },
      ElasticOut: function (t) {
        var i,
          e = 0.1;
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (!e || e < 1
              ? ((e = 1), (i = 0.1))
              : (i = (0.4 * Math.asin(1 / e)) / (2 * Math.PI)),
            e *
              Math.pow(2, -10 * t) *
              Math.sin(((t - i) * (2 * Math.PI)) / 0.4) +
              1);
      },
      ElasticInOut: function (t) {
        var i,
          e = 0.1,
          s = 0.4;
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (!e || e < 1
              ? ((e = 1), (i = 0.1))
              : (i = (s * Math.asin(1 / e)) / (2 * Math.PI)),
            (t *= 2) < 1
              ? e *
                Math.pow(2, 10 * (t -= 1)) *
                Math.sin(((t - i) * (2 * Math.PI)) / s) *
                -0.5
              : e *
                  Math.pow(2, -10 * (t -= 1)) *
                  Math.sin(((t - i) * (2 * Math.PI)) / s) *
                  0.5 +
                1);
      },
    };
  })()
),
  (function () {
    (pc.AppBase.prototype.addTweenManager = function () {
      (this._tweenManager = new pc.TweenManager(this)),
        this.on("update", function (t) {
          this._tweenManager.update(t);
        });
    }),
      (pc.AppBase.prototype.tween = function (t) {
        return new pc.Tween(t, this._tweenManager);
      }),
      (pc.Entity.prototype.tween = function (t, i) {
        var e = this._app.tween(t);
        return (
          (e.entity = this),
          this.once("destroy", e.stop, e),
          i && i.element && (e.element = i.element),
          e
        );
      });
    var t = pc.AppBase.getApplication();
    t && t.addTweenManager();
  })();
var EmoteDb = pc.createScript("emoteDb");
(EmoteDb.prototype.initialize = function () {
  this.app.emotes = this;
}),
  (EmoteDb.prototype.getEmoteByNum = function (t) {
    for (let e in this.entity.children) {
      let i = this.entity.children[e];
      if (i.script && i.script.emoteItem && i.script.emoteItem.emoteNum === t)
        return i.script.emoteItem;
    }
    return null;
  });
var RtlElement = pc.createScript("rtlElement");
RtlElement.prototype.initialize = function () {
  this.entity.element &&
    (this.app.systems.element._unicodeConverter &&
      (this.entity.element.unicodeConverter = !0),
    this.app.systems.element._rtlReorder &&
      (this.entity.element.rtlReorder = !0));
};
var Inventory = pc.createScript("inventory");
(Inventory.prototype.initialize = function () {
  this.items = { plants: [], seeds: [], potions: [] };
}),
  (Inventory.prototype.load = function (t) {
    (this.items.plants = t.plants || []),
      (this.items.seeds = t.seeds || []),
      (this.items.potions = t.potions || []),
      this.app.fire("inventory:loaded", this.items),
      this.app.on("garden:plant:sold", this._onPlantSold, this),
      console.log("Loaded inventory:", this.items);
  }),
  (Inventory.prototype.addSeed = function (t) {
    return this._addItem("seeds", t);
  }),
  (Inventory.prototype.withdrawSeed = function (t) {
    return this._withdrawItem("seeds", t);
  }),
  (Inventory.prototype.addPlant = function (t) {
    return this._addItem("plants", t);
  }),
  (Inventory.prototype.withdrawPlant = function (t) {
    return this._withdrawItem("plants", t);
  }),
  (Inventory.prototype.addPotion = function (t) {
    return this._addItem("potions", t);
  }),
  (Inventory.prototype.withdrawPotion = function (t) {
    return this._withdrawItem("potions", t);
  }),
  (Inventory.prototype._addItem = function (t, e) {
    let n = this.items[t];
    for (let i in n)
      if (n[i].id === e)
        return (this.items[t][i].quantity += 1), this._persist(), !0;
    return (
      this.items[t].push({ id: e, quantity: 1 }),
      this._persist(),
      console.log("Added item " + e + " to inventory:", this.items),
      !0
    );
  }),
  (Inventory.prototype._withdrawItem = function (t, e) {
    let n = this.items[t];
    for (let i = n.length - 1; i >= 0; i--)
      if (n[i].id === e)
        return (
          (this.items[t][i].quantity -= 1),
          this.items[t][i].quantity <= 0 && this.items[t].splice(i, 1),
          this._persist(),
          !0
        );
    return (
      console.log(
        "Item " + e + " not found in " + t + " inventory:",
        this.items[t]
      ),
      !1
    );
  }),
  (Inventory.prototype.getItemCount = function (t, e) {
    let n = this.items[t];
    if (void 0 === e) {
      let t = 0;
      for (let e in n) t += n[e].quantity;
      return t;
    }
    for (let t in n) if (n[t].id === e) return n[t].quantity;
    return 0;
  }),
  (Inventory.prototype._persist = function () {
    this.app.fire("inventory:updated", this.items),
      this.app.saveStats("localInventory", this.items);
  }),
  (Inventory.prototype._onPlantSold = function (t) {
    console.log("we just sold", t), this._unequipIfEmpty(t);
  }),
  (Inventory.prototype._unequipIfEmpty = function (t) {
    this.app.globals.localInventory.getItemCount("plants", t.id) <= 0 &&
      this.dequipItem();
  }),
  (Inventory.prototype.equipItem = function (t) {
    this._wear(t);
  }),
  (Inventory.prototype.dequipItem = function () {
    this._wear("handheldNone");
  }),
  (Inventory.prototype._wear = function (t) {
    let e = this.app.globals.localOutfit;
    (e.selection.handhelds.selected = t),
      e.wearItem("handheldSlot", e.selection.handhelds),
      this.app.saveStats("player", e.selection),
      (this.app.globals.outfitWasChanged = !0);
  });
var CurrencySystem = pc.createScript("currencySystem");
CurrencySystem.attributes.add("starIcon", { type: "entity" }),
  CurrencySystem.attributes.add("starUiGroup", { type: "entity" }),
  CurrencySystem.attributes.add("starUiCount", { type: "entity" }),
  CurrencySystem.attributes.add("starBackgroundColor", { type: "entity" }),
  CurrencySystem.attributes.add("errorStateTimeS", {
    type: "number",
    default: 3,
  }),
  CurrencySystem.attributes.add("errorStateCurve", {
    type: "curve",
    description: "Delta path between default and error colors.",
  }),
  (CurrencySystem.prototype.initialize = function () {
    (this.app.currency = this),
      this.app.on("stars:earn", this._onEarn, this),
      this.app.on("stars:spend", this._onSpend, this),
      (this._errorTimeLeftS = 0),
      (this._backgroundDefaultColor = new pc.Color(231 / 256, 228 / 256, 1)),
      (this._backgroundRedColor = new pc.Color(
        237 / 256,
        150 / 256,
        150 / 256
      )),
      (this._backgroundColor = new pc.Color().copy(
        this._backgroundDefaultColor
      )),
      (this._visualStarCount = { target: 0, displayed: 0 });
  }),
  (CurrencySystem.prototype.update = function (t) {
    let r = this._errorTimeLeftS;
    if (r > 0) {
      r -= t;
      const s = 1 - r / this.errorStateTimeS,
        e = this.errorStateCurve.value(s);
      this._backgroundColor.lerp(
        this._backgroundDefaultColor,
        this._backgroundRedColor,
        e
      ),
        (this.starBackgroundColor.element.color = this._backgroundColor),
        r <= 0 &&
          (this._backgroundColor.copy(this._backgroundDefaultColor),
          (this.starBackgroundColor.element.color = this._backgroundColor)),
        (this._errorTimeLeftS = r);
    }
    let s = this._visualStarCount;
    if (s.target != s.displayed) {
      const t = Math.abs(s.target - s.displayed);
      (s.displayed =
        t <= 1 ? s.target : pc.math.lerp(s.displayed, s.target, 0.06)),
        (this.starUiCount.element.text = parseInt(
          s.displayed
        ).toLocaleString()),
        (this._visualStarCount = s);
    }
  }),
  (CurrencySystem.prototype.load = function (t) {
    void 0 !== t.starCount &&
      ((this.app.globals.starCount = t.starCount),
      (this._visualStarCount.displayed = t.starCount),
      (this._visualStarCount.target = t.starCount),
      (this.starUiCount.element.text = parseInt(
        this._visualStarCount.displayed
      ).toLocaleString()));
  }),
  (CurrencySystem.prototype._onEarn = function (t) {
    t <= 0 ||
      (this.starIcon.script.pulse.start(),
      (this.app.globals.starCount += t),
      (this._visualStarCount.target = this.app.globals.starCount),
      this.app.saveStats("starCount", this.app.globals.starCount));
  }),
  (CurrencySystem.prototype._onSpend = function (t) {
    t <= 0 ||
      (this.app.globals.starCount >= t
        ? (this.starIcon.script.pulse.start(),
          (this.app.globals.starCount -= t),
          (this._visualStarCount.target = this.app.globals.starCount),
          this.app.saveStats("starCount", this.app.globals.starCount))
        : (console.warn("Not enough stars to spend:", t),
          this.showErrorState()));
  }),
  (CurrencySystem.prototype.showErrorState = function () {
    this.starIcon.script.pulse.start(),
      this.starUiCount.script.bounce.start(),
      (this._errorTimeLeftS = this.errorStateTimeS);
  });
var InventoryItemInfoPanel = pc.createScript("inventoryItemInfoPanel");
InventoryItemInfoPanel.attributes.add("displayName", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("quantity", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("image", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("seedInfoGroup", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("plantInfoGroup", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("plantSellGroup", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("potionInfoGroup", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("sellForLabel", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("starIcon", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("rarityIcon", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("rarityText", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("sellButton", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("plantButton", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("confirmSellPlantName", {
    type: "entity",
  }),
  InventoryItemInfoPanel.attributes.add("cancelSellButton", { type: "entity" }),
  InventoryItemInfoPanel.attributes.add("confirmSellButton", {
    type: "entity",
  }),
  InventoryItemInfoPanel.attributes.add("confirmSellAmount", {
    type: "entity",
  }),
  (InventoryItemInfoPanel.prototype.initialize = function () {
    this.app.on("garden:seed:planted", this._onSeedPlanted, this),
      this.plantButton.button.on("click", this._onPlantButtonClick, this),
      this.sellButton.button.on("click", this._onSellButtonClick, this),
      this.cancelSellButton.button.on(
        "click",
        () => {
          setTimeout(
            function () {
              this._hidePlantSellConfirmation();
            }.bind(this),
            250
          );
        },
        this
      ),
      this.confirmSellButton.button.on(
        "click",
        this._onConfirmSellButtonClick,
        this
      ),
      (this.rarityText.element.text = this.app.i18n.getText(
        this.rarityText.element.text,
        this.app.i18n.locale
      ));
  }),
  (InventoryItemInfoPanel.prototype.setGardenItem = function (t) {
    (this._gardenItem = t),
      (this.displayName.enabled = !0),
      (this.quantity.enabled = !0),
      (this.image.enabled = !0),
      (this.displayName.element.text = this.app.i18n.getText(
        t.displayName,
        this.app.i18n.locale
      )),
      (this.quantity.element.text = "x" + t.inventoryQuantity.toLocaleString()),
      (this.image.element.spriteAsset = t.sprite),
      (this.seedInfoGroup.enabled = !1),
      (this.plantInfoGroup.enabled = !1),
      (this.potionInfoGroup.enabled = !1),
      (this.plantSellGroup.enabled = !1),
      t.entity.script.seed
        ? ((this.seedInfoGroup.enabled = !0),
          null != this.app.gardening.activeGardenPatch
            ? ((this.plantButton.enabled = !0),
              !1 === this.plantButton.script.pulse.isPulsing() &&
                this.plantButton.script.pulse.start())
            : (this.plantButton.enabled = !1))
        : t.entity.script.plant
        ? (console.log("showing garden item", t),
          this._hidePlantSellConfirmation(),
          (this.sellButton.enabled = !0),
          (this.sellForLabel.element.text =
            this.app.i18n.getText("Sell for: ", this.app.i18n.locale) +
            t.sellPrice.toLocaleString()),
          (this.starIcon.enabled = !0),
          (this.rarityIcon.enabled = !0),
          (this.rarityIcon.element.spriteAsset =
            this.app.gardening.rarities[t.rarity].sprite))
        : t.entity.script.potion && (this.potionInfoGroup.enabled = !0);
  }),
  (InventoryItemInfoPanel.prototype._onSeedPlanted = function (t) {
    t.gardenPatch &&
      t.gardenPatch.entity._guid ===
        this.app.gardening.activeGardenPatch.entity._guid &&
      ((this.plantButton.enabled = !1), this.plantButton.script.pulse.stop());
  }),
  (InventoryItemInfoPanel.prototype._onPlantButtonClick = function () {
    const t = this._gardenItem;
    t &&
      t.entity &&
      t.entity.script &&
      t.entity.script.seed &&
      this.app.fire("garden:plant:seed", t),
      this.app.fire("upwardTone");
  }),
  (InventoryItemInfoPanel.prototype._onSellButtonClick = function () {
    setTimeout(
      function () {
        (this.image.enabled = !1),
          (this.quantity.enabled = !1),
          (this.displayName.enabled = !1),
          (this.plantInfoGroup.enabled = !1),
          (this.plantSellGroup.enabled = !0),
          (this.confirmSellPlantName.element.text = this.app.i18n.getText(
            this._gardenItem.displayName,
            this.app.i18n.locale
          )),
          (this.confirmSellAmount.element.text =
            "+" + this._gardenItem.sellPrice.toLocaleString()),
          this.app.fire("sound:pop:pitch1.5");
      }.bind(this),
      250
    );
  }),
  (InventoryItemInfoPanel.prototype._hidePlantSellConfirmation = function () {
    (this.image.enabled = !0),
      (this.quantity.enabled = !0),
      (this.displayName.enabled = !0),
      (this.plantInfoGroup.enabled = !0),
      (this.plantSellGroup.enabled = !1),
      this.app.fire("sound:pop:pitch1.5");
  }),
  (InventoryItemInfoPanel.prototype._onConfirmSellButtonClick = function () {
    this.app.fire("garden:plant:sell", this._gardenItem.id),
      this._hidePlantSellConfirmation(),
      this.app.fire("upwardTone");
  });
var ScreenSystem = pc.createScript("screenSystem");
ScreenSystem.attributes.add("starGroup", { type: "entity" }),
  ScreenSystem.attributes.add("background", { type: "entity" }),
  (ScreenSystem.prototype.initialize = function () {
    (this.screens = {}),
      (this._activeScreen = null),
      (this.app.screenSystem = this),
      (this._openScreenTimeout = null),
      (this._adjustedCameraPosition = new pc.Vec3()),
      this.app.on("escapeKey", this._onEscapeKey, this),
      this.background.element.on("click", this._closeActiveScreen, this);
  }),
  (ScreenSystem.prototype._onEscapeKey = function () {
    this.app.globals.isAdPlaying ||
      (null == this._activeScreen
        ? this.openScreen("mainMenu")
        : this.closeScreen(this._activeScreen.name));
  }),
  (ScreenSystem.prototype._closeActiveScreen = function () {
    this._activeScreen && this.closeScreen(this._activeScreen.name);
  }),
  (ScreenSystem.prototype.registerScreen = function (e, t) {
    this.screens[e] = t;
  }),
  (ScreenSystem.prototype.hasActiveScreen = function () {
    return null !== this._activeScreen;
  }),
  (ScreenSystem.prototype.closeActiveScreen = function () {
    this._activeScreen && this.closeScreen(this._activeScreen.name);
  }),
  (ScreenSystem.prototype.openScreen = function (e, t) {
    this._openScreenTimeout &&
      (clearTimeout(this._openScreenTimeout), (this._openScreenTimeout = null)),
      (this._openScreenTimeout = setTimeout(() => {
        if (this._activeScreen) {
          if (this._activeScreen.name === e)
            return console.warn("Screen already open:", e), !1;
          this.closeScreen(this._activeScreen.name);
        }
        if (
          ((this._activeScreen = this.screens[e]),
          this.app.worldButtonSystem.hide(),
          this.app.emojiSystem.hideEmojiPanel(),
          this._activeScreen.open(t),
          this.app.fire("poki:gameplayStop"),
          this._activeScreen.countsAsGameplay &&
            this.app.fire("poki:gameplayStart"),
          this._activeScreen.showHud
            ? this.app.hud.show()
            : this.app.hud.hide(),
          this._activeScreen.showStars && (this.starGroup.enabled = !0),
          t && t.hasOwnProperty("showBackground")
            ? (this.background.enabled = t.showBackground)
            : (this.background.enabled =
                this._activeScreen.showBackground || !1),
          t &&
            t.hasOwnProperty("cameraLookAt") &&
            t.hasOwnProperty("cameraSettings"))
        ) {
          const e = t.cameraSettings;
          (this._adjustedCameraPosition =
            this.app.getLayoutAdjustedCameraPosition(t.cameraLookAt, e)),
            this.app.fire(
              "cameraToStation",
              this._adjustedCameraPosition,
              e.cameraRot,
              e.cameraFov
            );
        }
        return !0;
      }));
  }),
  (ScreenSystem.prototype.closeScreen = function (e) {
    return (
      !(!this._activeScreen || this._activeScreen.name !== e) &&
      (this._activeScreen.close(),
      !1 === this._activeScreen.countsAsGameplay &&
        this.app.fire("poki:gameplayStart"),
      (this.background.enabled = !1),
      (this._activeScreen = null),
      this.app.hud.show(),
      setTimeout(() => {
        this.app.worldButtonSystem.show();
      }, 250),
      !0)
    );
  });
var Screen = pc.createScript("screen");
Screen.attributes.add("name", {
  type: "string",
  description:
    "The unique name of this screen, this will be used to hide and show screen via screenSystem",
}),
  Screen.attributes.add("content", { type: "entity" }),
  Screen.attributes.add("closeButton", {
    type: "entity",
    description: "Optional close button entity",
  }),
  Screen.attributes.add("hasTextInput", {
    type: "boolean",
    default: !1,
    description:
      "If true, screen will override Poki's default spacebar behavior to allow spaces in text input",
  }),
  Screen.attributes.add("movementAllowed", {
    type: "boolean",
    default: !1,
    description:
      "If false, player movement will be locked until the screen is closed",
  }),
  Screen.attributes.add("showBackground", {
    type: "boolean",
    default: !0,
    description:
      "If false, no transparent background will be shown when the screen is open. (Can be overridden with openScreen params)",
  }),
  Screen.attributes.add("showHud", {
    type: "boolean",
    default: !1,
    description:
      "If true, HUD elements will be shown when this screen is opened",
  }),
  Screen.attributes.add("showStars", {
    type: "boolean",
    default: !1,
    description:
      "If true, starUIGroup will be shown independently of the other HUD elements",
  }),
  Screen.attributes.add("countsAsGameplay", {
    type: "boolean",
    default: !1,
    description:
      "If true, gameplayStart will be fired when screen is shown (gameplayStop is always fired first).",
  }),
  (Screen.prototype.initialize = function () {
    (this.lastOpenTime = 0),
      (this.lastCloseTime = 0),
      this.app.screenSystem.registerScreen(this.name, this),
      this.closeButton &&
        this.closeButton.button.on("click", this._attemptClose, this),
      (this.app.getScreenAdjustedCameraPosition =
        this._getScreenAdjustedCameraPosition.bind(this)),
      (this.app.getLayoutAdjustedCameraPosition =
        this._getLayoutAdjustedCameraPosition.bind(this));
  }),
  (Screen.prototype.open = function (e = null) {
    (this.lastOpenTime = pc.now()),
      (this.content.enabled = !0),
      (this.app.globals.movementAllowed = this.movementAllowed),
      (this.app.globals.remotePlayerGroup.enabled = !1),
      (this.app.globals.formInputOpen = !!this.hasTextInput),
      this.app.globals.localCharAnims.setAnimIdle(),
      "portrait" == this.app.globals.layout && this.app.fire("chatbox:close"),
      this.entity.fire("screen:onOpen", e),
      this.hasTextInput && (this.app.globals.formInputOpen = !0),
      e &&
        e.hasOwnProperty("hideLocalPlayer") &&
        this.app.globals.localPlayer.script.localPlayer.hide(),
      e &&
        e.hasOwnProperty("activeStationName") &&
        (this.app.globals.activeStation = e.activeStationName);
  }),
  (Screen.prototype.close = function (e = null) {
    (this.lastCloseTime = pc.now()),
      (this.content.enabled = !1),
      this.app.fire("cameraToWorld"),
      (this.app.globals.formInputOpen = !1),
      (this.app.globals.activeStation = "world"),
      (this.app.globals.movementAllowed = !0),
      (this.app.globals.remotePlayerGroup.enabled = !0),
      this.app.globals.localPlayer.script.localPlayer.show(),
      this.entity.fire("screen:onClose", e);
  }),
  (Screen.prototype.isOpen = function () {
    return this.content.enabled;
  }),
  (Screen.prototype._attemptClose = function () {
    this.isOpen() &&
      pc.now() - this.lastCloseTime > 500 &&
      this.app.screenSystem.closeScreen(this.name);
  }),
  (Screen.prototype._getScreenAdjustedCameraPosition = function (e, t) {
    let a = new pc.Vec3();
    a.copy(e), (a.y = t.cameraY);
    const n = (t.cameraRot.y * Math.PI) / 180;
    (a.x += Math.sin(n) * t.cameraDistance),
      (a.z += Math.cos(n) * t.cameraDistance);
    const s = (t.cameraDistance * window.innerWidth) / window.innerHeight,
      i = ((t.cameraFov / 2) * Math.PI) / 180,
      o = s * Math.tan(i) * 2;
    return (a.x += Math.cos(n) * o * 0.2), (a.z -= Math.sin(n) * o * 0.2), a;
  }),
  (Screen.prototype._getLayoutAdjustedCameraPosition = function (e, t) {
    let a;
    return (
      (a =
        "landscape" == this.app.globals.layout
          ? this._getScreenAdjustedCameraPosition(e, t)
          : new pc.Vec3(e.x, e.y + t.cameraY, e.z + t.cameraDistance)),
      a
    );
  });
var CodeSystem = pc.createScript("codeSystem");
CodeSystem.attributes.add("freeCode", {
  type: "string",
  default: "HYDRO",
  description:
    "If changed, the new code will NOT be shown to players who have already redeemed the old code.",
}),
  (CodeSystem.prototype.initialize = function () {
    this.app.codes = this;
  }),
  (CodeSystem.prototype.isCodeRedeemed = function (e) {
    return this.app.globals.redeemedCodes.includes(e.toUpperCase());
  }),
  (CodeSystem.prototype.redeemCode = function (e, d, t) {
    if (!(e = e.toUpperCase()) || e.length <= 0) return t("Invalid code");
    if (this.isCodeRedeemed(e)) return t("Code already redeemed");
    const o = this.app.itemDb.entity.findScripts("dbItem");
    for (let t in o) {
      const r = o[t];
      if (
        r.redeemCode &&
        r.redeemCode.length > 0 &&
        r.redeemCode.toUpperCase() === e &&
        (this.app.globals.redeemedCodes.push(e),
        this.app.saveStats("redeemedCodes", this.app.globals.redeemedCodes),
        this.app.fire("code:redeemed", e),
        d)
      )
        return d(r);
    }
    return t("Invalid code");
  });
var CodeScreen = pc.createScript("codeScreen");
CodeScreen.attributes.add("menuPanel", { type: "entity" }),
  CodeScreen.attributes.add("unlockedPanel", { type: "entity" }),
  CodeScreen.attributes.add("unlockedItemSprite", { type: "entity" }),
  CodeScreen.attributes.add("title", { type: "entity" }),
  CodeScreen.attributes.add("inputBox", { type: "entity" }),
  CodeScreen.attributes.add("wearNowButton", { type: "entity" }),
  CodeScreen.attributes.add("doneButton", { type: "entity" }),
  CodeScreen.attributes.add("redeemButton", { type: "entity" }),
  CodeScreen.attributes.add("freeCodeLabel", { type: "entity" }),
  CodeScreen.attributes.add("freeCodeValue", { type: "entity" }),
  CodeScreen.attributes.add("errorStateTimeS", { type: "number", default: 3 }),
  CodeScreen.attributes.add("errorStateCurve", {
    type: "curve",
    description: "Delta path between default and error colors.",
  }),
  (CodeScreen.prototype.initialize = function () {
    this.entity.on("screen:onOpen", this._onOpen, this),
      this.redeemButton.button.on("click", this._redeem, this),
      this.app.on("enterKey", this._redeem, this),
      this.doneButton.button.on(
        "click",
        () => {
          this.app.screenSystem.closeScreen("codes");
        },
        this
      ),
      this.wearNowButton.button.on("click", this._wearUnlockedItem, this),
      (this._errorTimeLeftS = 0),
      (this._errorTimeoutId = null),
      (this._unlockedDbItem = null),
      (this._titleDefaultColor = new pc.Color(76 / 256, 0, 52 / 256)),
      (this._titleRedColor = new pc.Color(163 / 256, 14 / 256, 0)),
      (this._titleColor = new pc.Color().copy(this._titleDefaultColor)),
      (this._menuPanelDefaultColor = new pc.Color(231 / 256, 211 / 256, 1)),
      (this._menuPanelRedColor = new pc.Color(237 / 256, 150 / 256, 150 / 256)),
      (this._menuPanelColor = new pc.Color().copy(this._menuPanelDefaultColor));
  }),
  (CodeScreen.prototype._onOpen = function () {
    this._reset(),
      this.app.globals.freeCodeUsed
        ? ((this.freeCodeLabel.enabled = !1), (this.freeCodeValue.enabled = !1))
        : ((this.freeCodeLabel.enabled = !0),
          (this.freeCodeValue.enabled = !0),
          (this.freeCodeValue.element.text =
            this.app.codes.freeCode.toUpperCase()));
  }),
  (CodeScreen.prototype._reset = function () {
    (this._unlockedDbItem = null),
      (this.menuPanel.enabled = !0),
      (this.unlockedPanel.enabled = !1),
      this.inputBox.script.bounce.reset(),
      this._errorTimeoutId &&
        (clearTimeout(this._errorTimeoutId), (this._errorTimeoutId = null));
  }),
  (CodeScreen.prototype.update = function (e) {
    if (this._errorTimeLeftS > 0)
      if (((this._errorTimeLeftS -= e), this._errorTimeLeftS <= 0))
        (this.title.element.text = this.app.i18n.getText(
          "Enter a Code",
          this.app.i18n.locale
        )),
          (this.title.element.color = this._titleDefaultColor),
          (this.menuPanel.element.color = this._menuPanelDefaultColor),
          (this._errorTimeLeftS = 0);
      else {
        const e = this._errorTimeLeftS / this.errorStateTimeS;
        (this.title.element.color = this._titleColor.lerp(
          this._titleDefaultColor,
          this._titleRedColor,
          e
        )),
          (this.menuPanel.element.color = this._menuPanelColor.lerp(
            this._menuPanelDefaultColor,
            this._menuPanelRedColor,
            e
          ));
      }
  }),
  (CodeScreen.prototype._redeem = function () {
    if (this.entity.script.screen.isOpen()) {
      const e = this.inputBox.script.input.getValue();
      e.length > 0 &&
        (this.app.fire(
          "watcher:track",
          "code_redeem_attempt_" + e.toUpperCase()
        ),
        e.length > 0 &&
          this.app.codes.redeemCode(
            e,
            (t) => {
              (this.unlockedPanel.enabled = !0),
                (this.menuPanel.enabled = !1),
                this.inputBox.script.input.setValue(""),
                (this.unlockedItemSprite.element.spriteAsset = t.uiSprite),
                this.unlockedItemSprite.script.pulse.start(),
                (this._unlockedDbItem = t),
                this.app.fire("upwardTone"),
                e.toUpperCase() === this.app.codes.freeCode.toUpperCase() &&
                  ((this.app.globals.freeCodeUsed = !0),
                  this.app.saveStats("freeCodeUsed", !0));
            },
            (e) => {
              (this._errorTimeLeftS = this.errorStateTimeS),
                (this.title.element.text = this.app.i18n.getText(
                  e,
                  this.app.i18n.locale
                )),
                this.inputBox.script.bounce.start(),
                this.inputBox.script.input.setValue(""),
                this.inputBox.script.input.hideElement(),
                this._errorTimeoutId && clearTimeout(this._errorTimeoutId),
                (this._errorTimeoutId = setTimeout(() => {
                  (this.title.element.text = this.app.i18n.getText(
                    "Enter a Code",
                    this.app.i18n.locale
                  )),
                    (this.title.element.color = this._titleDefaultColor),
                    (this.menuPanel.element.color =
                      this._menuPanelDefaultColor),
                    this.entity.script.screen.isOpen() &&
                      this.inputBox.script.input.showElement();
                }, 1e3 * this.errorStateTimeS));
            }
          ));
    }
  }),
  (CodeScreen.prototype._wearUnlockedItem = function () {
    if (null == this._unlockedDbItem)
      return (
        console.error("Tried wearing a code-unlocked item that was null"),
        void this.close()
      );
    this.app.globals.ui
      .findByName(this._unlockedDbItem.entity.name)
      .script.fashionItem.setFashionItem(!1),
      this.app.screenSystem.closeScreen("codes");
  });
var CodesBox = pc.createScript("codesBox");
CodesBox.attributes.add("lid", { type: "entity" }),
  CodesBox.attributes.add("bodyYRotationCurve", { type: "curve" }),
  CodesBox.attributes.add("bodyRotationTime", { type: "number", default: 2 }),
  CodesBox.attributes.add("lidYPosCurve", { type: "curve" }),
  CodesBox.attributes.add("lidZEulerCurve", { type: "curve" }),
  CodesBox.attributes.add("lidOpenTime", { type: "number", default: 1 }),
  CodesBox.attributes.add("worldButtonMarker", { type: "entity" }),
  CodesBox.attributes.add("sparkles", { type: "entity" }),
  (CodesBox.prototype.initialize = function () {
    (this._lidCountdownS = 0),
      (this._lidDirection = ""),
      (this._bodyRotationCountdownS = this.bodyRotationTime),
      window.setVDynamic(this.lid, !0),
      window.setVDynamic(this.entity, !0),
      (this.markerScript = this.worldButtonMarker.script.worldButtonMarker),
      this.markerScript.on("marker:show", this.open, this),
      this.markerScript.on("marker:hide", this.close, this),
      this.markerScript.on("button:clicked", this._openForm, this);
  }),
  (CodesBox.prototype.open = function () {
    (this._lidDirection = "open"),
      (this._lidCountdownS = this.lidOpenTime),
      this.sparkles.particlesystem.play(),
      setTimeout(
        function () {
          this.sparkles.particlesystem.stop(),
            this.sparkles.particlesystem.reset();
        }.bind(this),
        1e3 * this.lidOpenTime
      );
  }),
  (CodesBox.prototype.close = function () {
    (this._lidCountdownS = this.lidOpenTime),
      (this._lidDirection = "close"),
      this._closeForm();
  }),
  (CodesBox.prototype.update = function (t) {
    let o = this._lidCountdownS;
    if (o > 0) {
      (o -= t), o < 0 && (o = 0);
      let e = 1 - o / this.lidOpenTime;
      "close" === this._lidDirection && (e = 1 - e),
        this.lid.setLocalPosition(0, this.lidYPosCurve.value(e), 0),
        this.lid.setLocalEulerAngles(0, 0, this.lidZEulerCurve.value(e)),
        (this._lidCountdownS = o);
    }
    (this._bodyRotationCountdownS -= t),
      this._bodyRotationCountdownS <= 0 &&
        (this._bodyRotationCountdownS = this.bodyRotationTime);
    let e = 1 - this._bodyRotationCountdownS / this.bodyRotationTime,
      i = this.bodyYRotationCurve.value(e);
    this.entity.setLocalEulerAngles(0, i, 0);
  }),
  (CodesBox.prototype._openForm = function () {
    this.app.screenSystem.openScreen("codes");
  }),
  (CodesBox.prototype._closeForm = function () {
    this.app.screenSystem.closeScreen("codes");
  });
var SuggestionScreen = pc.createScript("suggestionScreen");
SuggestionScreen.attributes.add("inputBox", { type: "entity" }),
  SuggestionScreen.attributes.add("submitButton", { type: "entity" }),
  (SuggestionScreen.prototype.initialize = function () {
    this.submitButton.button.on("click", this._submit, this),
      this.app.on("enterKey", this._submit, this);
  }),
  (SuggestionScreen.prototype._submit = function () {
    if (this.entity.script.screen.isOpen()) {
      const t = this.inputBox.script.input.getValue();
      if (t.length > 0) {
        this.app.screenSystem.closeScreen("suggestions"),
          this.inputBox.script.input.setValue("");
        const e = document.createElement("iframe");
        (e.name = "hidden_iframe"),
          (e.style.display = "none"),
          document.body.appendChild(e);
        const i = document.createElement("form");
        (i.method = "POST"),
          (i.action =
            "https://vortellas-admin.v1digital.com/api/suggestions/create"),
          (i.target = "hidden_iframe"),
          (i.style.display = "none");
        const addField = (t, e) => {
          const n = document.createElement("input");
          (n.type = "hidden"), (n.name = t), (n.value = e), i.appendChild(n);
        };
        addField("suggestion", t),
          addField("locale", this.app.i18n.locale),
          document.body.appendChild(i),
          i.submit(),
          e.addEventListener("load", () => {
            document.body.removeChild(i), document.body.removeChild(e);
          }),
          this.app.fire("suggestion:submitted");
      }
    }
  });
var ScreenTrigger = pc.createScript("screenTrigger");
ScreenTrigger.attributes.add("screenName", {
  type: "string",
  description: "The name of the screen to open when triggered",
}),
  (ScreenTrigger.prototype.initialize = function () {
    (this._hasTriggered = !1),
      (this.boundingBox = this.entity.script.boundingBox);
  }),
  (ScreenTrigger.prototype.update = function (e) {
    if (
      !(
        this.app.screenSystem.hasActiveScreen() ||
        (!1 === this._hasTriggered && this.app.inputState.pressingAny) ||
        FrameTracker.num % 4 != 0
      )
    ) {
      const e = this.app.globals.localPlayer.getPosition();
      this.boundingBox.contains(e) && !1 === this._hasTriggered
        ? (this.app.screenSystem.openScreen(this.screenName),
          (this._hasTriggered = !0))
        : this.boundingBox.contains(e) ||
          !0 !== this._hasTriggered ||
          (this.app.screenSystem.closeScreen(this.screenName),
          (this._hasTriggered = !1));
    }
  });
var VipScreen = pc.createScript("vipScreen");
VipScreen.attributes.add("getAccessButton", { type: "entity" }),
  VipScreen.attributes.add("confirmLeaveText", { type: "entity" }),
  VipScreen.attributes.add("errorTimeText", { type: "entity" }),
  (VipScreen.prototype.initialize = function () {
    this.entity.on("screen:onOpen", this._onOpen, this),
      this.app.on("vip:access:granted", this._onAccessGranted, this),
      this.getAccessButton.button.on("click", this._requestAccess, this);
  }),
  (VipScreen.prototype._onOpen = function () {
    0 == this.app.competition.phase.length ||
    this.app.competition.isAdWatchable()
      ? ((this.getAccessButton.button.active = !0),
        (this.confirmLeaveText.enabled = !0),
        (this.errorTimeText.enabled = !1),
        PokiSDK.measure("rewarded", "visible", "vip_offer"),
        this.app.fire("vip:access:offer"))
      : ((this.getAccessButton.button.active = !1),
        (this.confirmLeaveText.enabled = !1),
        (this.errorTimeText.enabled = !0));
  }),
  (VipScreen.prototype._onAccessGranted = function () {
    this.app.screenSystem.closeScreen("vip");
  }),
  (VipScreen.prototype._requestAccess = function () {
    PokiSDK.measure("rewarded", "click", "vip_offer"),
      this.app.fire("vip:access:request");
  });
var RoomExitScreen = pc.createScript("roomExitScreen");
RoomExitScreen.attributes.add("areaName", {
  type: "string",
  default: "room:exit",
  description:
    "This room area will be transmitted to the server when player leaves the room.",
}),
  RoomExitScreen.attributes.add("stayButton", { type: "entity" }),
  RoomExitScreen.attributes.add("leaveButton", { type: "entity" }),
  (RoomExitScreen.prototype.initialize = function () {
    this.leaveButton.button.on("click", this._onLeave, this),
      this.stayButton.button.on("click", this._closeModal, this),
      this.app.on("competition:phase:start", this._closeModal, this);
  }),
  (RoomExitScreen.prototype._closeModal = function () {
    this.app.screenSystem.closeScreen("roomExit");
  }),
  (RoomExitScreen.prototype._onLeave = function () {
    this._transmitPlayerArea(this.areaName),
      this.app.fire("roomExit:exit"),
      !1 === this.app.tracking.exitedCompetition &&
        ((this.app.tracking.exitedCompetition = !0),
        this.app.fire("watcher:track", "first_competition_exit")),
      this._closeModal();
  }),
  (RoomExitScreen.prototype._transmitPlayerArea = function (t = "") {
    this.app.server.send(
      MessagePack.encode([this.app.networkCodes.PLAYER_AREA, [[[3, t]]]])
    );
  });
var MenuScreen = pc.createScript("menuScreen");
MenuScreen.attributes.add("menuHudButton", { type: "entity" }),
  MenuScreen.attributes.add("nameBox", { type: "entity" }),
  MenuScreen.attributes.add("createRoomBtn", { type: "entity" }),
  MenuScreen.attributes.add("joinRoomBtn", { type: "entity" }),
  MenuScreen.attributes.add("leaveBtn", { type: "entity" }),
  MenuScreen.attributes.add("leaveConfirmBtn", { type: "entity" }),
  MenuScreen.attributes.add("backButton", { type: "entity" }),
  MenuScreen.attributes.add("copyBtn", { type: "entity" }),
  MenuScreen.attributes.add("roomCodeText", { type: "entity" }),
  MenuScreen.attributes.add("stayInRoomButton", { type: "entity" }),
  MenuScreen.attributes.add("joinViaCodeButton", { type: "entity" }),
  MenuScreen.attributes.add("joinRoomInputDom", { type: "entity" }),
  MenuScreen.attributes.add("joinRoomErrorMessage", { type: "entity" }),
  MenuScreen.attributes.add("resetOutfitPromptBtn", { type: "entity" }),
  MenuScreen.attributes.add("keepOutfitBtn", { type: "entity" }),
  MenuScreen.attributes.add("resetOutfitConfirmBtn", { type: "entity" }),
  MenuScreen.attributes.add("resetOutfitStation", { type: "entity" }),
  MenuScreen.attributes.add("codesButton", { type: "entity" }),
  MenuScreen.attributes.add("mainMenuScreen", { type: "entity", array: !0 }),
  MenuScreen.attributes.add("customMenuScreen", { type: "entity", array: !0 }),
  MenuScreen.attributes.add("creatingRoomWaitScreen", {
    type: "entity",
    array: !0,
  }),
  MenuScreen.attributes.add("leaveRoomMenuScreen", {
    type: "entity",
    array: !0,
  }),
  MenuScreen.attributes.add("leavingRoomWaitScreen", {
    type: "entity",
    array: !0,
  }),
  MenuScreen.attributes.add("joinRoomMenuScreen", {
    type: "entity",
    array: !0,
  }),
  MenuScreen.attributes.add("joiningRoomWaitScreen", {
    type: "entity",
    array: !0,
  }),
  MenuScreen.attributes.add("resetOutfitMenuScreen", {
    type: "entity",
    array: !0,
  }),
  (MenuScreen.prototype.initialize = function () {
    (this.menuScreenEntities = this.app.globals.ui.findByTag("menuEntity")),
      (this.isCustomRoom = !1),
      (this.menuScreenOpenedOnce = !1),
      this.menuHudButton.button.on("click", this._openMainMenuScreen, this),
      this.createRoomBtn.button.on("click", this.createRoom, this),
      this.backButton.button.on("click", this._swapToMainMenu, this),
      this.app.on("competition:phase:start", this._closeMenuScreen, this),
      this.entity.on("screen:onOpen", this._onOpen, this),
      this.entity.on("screen:onClose", this._onClose, this),
      this.app.on(
        "joinRoomInput:change",
        function (e) {
          this._formatRoomCode(e);
        },
        this
      ),
      this.leaveBtn.button.on(
        "click",
        function () {
          this.swapMenuScreen(this.leaveRoomMenuScreen);
        },
        this
      ),
      this.copyBtn.button.on("click", this.copyRoomURL, this),
      this.stayInRoomButton.button.on("click", this._swapToMainMenu, this),
      this.leaveConfirmBtn.button.on("click", this.leavingRoomScreen, this),
      this.joinRoomBtn.button.on(
        "click",
        function () {
          this.clearErrorMessage(),
            this.swapMenuScreen(this.joinRoomMenuScreen);
        },
        this
      ),
      this.joinViaCodeButton.button.on("click", this.tryJoinViaCode, this),
      this.app.on("uiinput:clicked", this.clearErrorMessage, this),
      this.resetOutfitPromptBtn.button.on(
        "click",
        function () {
          this.swapMenuScreen(this.resetOutfitMenuScreen);
        },
        this
      ),
      this.keepOutfitBtn.button.on("click", this._swapToMainMenu, this),
      this.resetOutfitConfirmBtn.button.on(
        "click",
        function () {
          this.resetOutfitStation.script.resetOutfit.resetOutfit(),
            this._closeMenuScreen();
        },
        this
      ),
      this.codesButton.button.on(
        "click",
        function () {
          setTimeout(
            function () {
              this.app.screenSystem.openScreen("codes");
            }.bind(this),
            300
          );
        },
        this
      ),
      this.swapMenuScreen(this.mainMenuScreen);
  }),
  (MenuScreen.prototype._onOpen = function () {
    !1 === this.menuScreenOpenedOnce &&
      ((this.menuScreenOpenedOnce = !0),
      this.app.fire("watcher:track", "first_menu_screen_open")),
      this.app.fire("menu:open"),
      this.isCustomRoom
        ? this.swapMenuScreen(this.customMenuScreen)
        : this.swapMenuScreen(this.mainMenuScreen);
  }),
  (MenuScreen.prototype._onClose = function () {
    this.app.fire("menu:close");
  }),
  (MenuScreen.prototype._openMainMenuScreen = function () {
    this.app.screenSystem.openScreen("mainMenu");
  }),
  (MenuScreen.prototype._closeMenuScreen = function () {
    this.entity.script.screen.isOpen() &&
      (this.app.screenSystem.closeScreen("mainMenu"), this._swapToMainMenu());
  }),
  (MenuScreen.prototype._swapToMainMenu = function () {
    this.isCustomRoom
      ? this.swapMenuScreen(this.customMenuScreen)
      : this.swapMenuScreen(this.mainMenuScreen);
  }),
  (MenuScreen.prototype.swapMenuScreen = function (e) {
    setTimeout(
      function () {
        this.menuScreenEntities.forEach(function (e) {
          e.enabled = !1;
        }),
          e.forEach(function (e) {
            e.enabled = !0;
          }),
          this.isCustomRoom
            ? this.resetOutfitPromptBtn.setLocalPosition(0, -210, 0)
            : this.resetOutfitPromptBtn.setLocalPosition(0, -145, 0);
      }.bind(this),
      50
    ),
      this.clearErrorMessage();
  }),
  (MenuScreen.prototype.createRoom = function () {
    this.swapMenuScreen(this.creatingRoomWaitScreen),
      this.app.fire(
        "network:create:room",
        () => {
          (this.isCustomRoom = !0),
            (this.roomCodeText.element.text = this.app.globals.customRoomCode),
            setTimeout(
              function () {
                this._swapToMainMenu();
              }.bind(this),
              300
            );
        },
        this
      );
  }),
  (MenuScreen.prototype.leavingRoomScreen = function () {
    this.swapMenuScreen(this.leavingRoomWaitScreen),
      this.app.fire(
        "network:leave:room",
        () => {
          (this.isCustomRoom = !1),
            setTimeout(
              function () {
                this._closeMenuScreen();
              }.bind(this),
              300
            );
        },
        this
      );
  }),
  (MenuScreen.prototype.copyRoomURL = function () {
    let e = this.copyBtn.findByName("copyText"),
      t = this.copyBtn.findByName("copyConfirm");
    PokiSDK.shareableURL({ roomCode: this.roomCodeText.element.text }).then(
      (e) => {
        navigator.clipboard.writeText(e);
      }
    ),
      (e.enabled = !1),
      (t.enabled = !0),
      setTimeout(function () {
        (e.enabled = !0), (t.enabled = !1);
      }, 1500);
  }),
  (MenuScreen.prototype.tryJoinViaCode = function () {
    const e = this.joinRoomInputDom.script.input.getValue();
    if (e) {
      let t = e.toUpperCase();
      if (t.length <= 0)
        return (
          (this.joinRoomErrorMessage.element.text = "Please enter a room code"),
          void (this.joinRoomErrorMessage.enabled = !0)
        );
      if (t.length < 5)
        return (
          (this.joinRoomErrorMessage.element.text =
            "Please enter a 5 digit room code"),
          void (this.joinRoomErrorMessage.enabled = !0)
        );
      this.swapMenuScreen(this.joiningRoomWaitScreen),
        this.clearErrorMessage(),
        this.app.fire(
          "network:join:room",
          t,
          function () {
            this._closeMenuScreen(),
              (this.isCustomRoom = !0),
              (this.roomCodeText.element.text =
                this.app.globals.customRoomCode);
          }.bind(this),
          function (e) {
            this.swapMenuScreen(this.joinRoomMenuScreen),
              (this.joinRoomErrorMessage.element.text = e),
              (this.joinRoomErrorMessage.enabled = !0);
          }.bind(this)
        );
    }
  }),
  (MenuScreen.prototype.clearErrorMessage = function () {
    this.joinRoomErrorMessage.element.text = "";
  }),
  (MenuScreen.prototype._formatRoomCode = function (e) {
    let t = e.replace(/\s/g, "");
    (t = e.includes("http") ? this._getRoomCodeFromUrl(e) : t.toUpperCase()),
      (t = t.substring(0, 5)),
      this.joinRoomInputDom.script.input.setValue(t);
  }),
  (MenuScreen.prototype._getRoomCodeFromUrl = function (e) {
    let t = new URL(e),
      n = t.searchParams.get("gdroomCode");
    return n
      ? n.toUpperCase()
      : ((n = t.searchParams.get("roomCode")), n ? n.toUpperCase() : "");
  });
var InventoryScreen = pc.createScript("inventoryScreen");
InventoryScreen.attributes.add("inventoryHUDButton", { type: "entity" }),
  InventoryScreen.attributes.add("itemInfoPanel", { type: "entity" }),
  InventoryScreen.attributes.add("inventoryItemUiTemplate", {
    type: "asset",
    assetType: "template",
  }),
  InventoryScreen.attributes.add("tabs", {
    type: "json",
    array: !0,
    schema: [
      { name: "name", type: "string" },
      { name: "noItemsMessage", type: "entity" },
      {
        name: "dequipButton",
        type: "asset",
        assetType: "template",
        description: "(Optional)",
      },
      { name: "shopTeleportButton", type: "entity", description: "(Optional)" },
      { name: "button", type: "entity" },
      { name: "buttonText", type: "entity" },
      { name: "scrollview", type: "entity" },
      { name: "scrollviewContent", type: "entity" },
    ],
  }),
  InventoryScreen.attributes.add("tabNavAnchors", { type: "vec4", array: !0 }),
  InventoryScreen.attributes.add("cameraSettingsLandscape", {
    type: "json",
    schema: [
      { name: "offsetY", type: "number", default: 1.35 },
      { name: "cameraDistance", type: "number", default: 3.5 },
      { name: "cameraRot", type: "vec3" },
      { name: "cameraFov", type: "number", default: 40 },
    ],
  }),
  InventoryScreen.attributes.add("cameraSettingsPortrait", {
    type: "json",
    schema: [
      { name: "offsetY", type: "number", default: 1.35 },
      { name: "cameraDistance", type: "number", default: 5 },
      { name: "cameraRot", type: "vec3" },
      { name: "cameraFov", type: "number", default: 40 },
    ],
  }),
  (InventoryScreen.prototype.initialize = function () {
    (this._mode = "default"),
      (this._activeTab = null),
      (this._tabActiveColor = new pc.Color(0.973, 1, 0.965)),
      (this._tabInactiveColor = new pc.Color(0.847, 1, 0.804)),
      (this._selectedItem = null),
      (this._selectedItemColor = new pc.Color(0.85, 1, 0.8)),
      (this._unSelectedItemColor = new pc.Color(1, 1, 1)),
      (this._lockedPosition = new pc.Vec3()),
      (this.screen = this.entity.script.screen);
    for (let t = 0; t < this.tabs.length; t++) {
      const e = this.tabs[t];
      e.button.button.on("click", this._showTab.bind(this, e.name)),
        e.shopTeleportButton &&
          e.shopTeleportButton.button.on(
            "click",
            this._teleportToShop.bind(this, e.name),
            this
          );
    }
    this.inventoryHUDButton.button.on("click", this._openInventory, this),
      this.app.on("garden:plant:sold", this._onInventoryUpdated, this),
      this.app.on("inventory:updated", this._onInventoryUpdated, this),
      this.entity.on("screen:onOpen", this._onOpen, this),
      this.entity.on("screen:onClose", this._onClose, this);
  }),
  (InventoryScreen.prototype.postUpdate = function () {
    if (this.screen.isOpen()) {
      this.app.globals.localPlayer.setPosition(this._lockedPosition);
      let t = this._activeTab;
      if (t) {
        t.scrollviewContent.element.width =
          t.scrollview.element.calculatedWidth;
        if (t.scrollviewContent.children.length > 0) {
          const e = t.scrollviewContent.children[0],
            n = Math.floor(
              t.scrollview.element.calculatedWidth /
                (1.1 * e.element.calculatedWidth)
            ),
            o = Math.ceil(t.scrollviewContent.children.length / n);
          let i = 0;
          this.itemInfoPanel.enabled &&
            (i = 1.1 * this.itemInfoPanel.element.calculatedHeight),
            (t.scrollviewContent.element.height =
              i + o * (1.1 * e.element.calculatedHeight));
        }
      }
    }
  }),
  (InventoryScreen.prototype._openInventory = function () {
    let t;
    !1 === this.app.tracking.openedInventory &&
      ((this.app.tracking.openedInventory = !0),
      this.app.fire("watcher:track", "first_inventory_open")),
      this.app.globals.localPlayer.script.localPlayerMovement.faceCamera(),
      "portrait" == this.app.globals.layout
        ? ((t = this.cameraSettingsPortrait), (t.cameraY = t.offsetY))
        : ((t = this.cameraSettingsLandscape),
          (t.cameraY =
            this.app.globals.localPlayer.getPosition().y + t.offsetY)),
      this.app.screenSystem.openScreen("inventory", {
        cameraLookAt: this.app.globals.localPlayer.getPosition(),
        activeStationName: "inventory",
        cameraSettings: t,
      });
  }),
  (InventoryScreen.prototype._onOpen = function (t) {
    this._lockedPosition.copy(this.app.globals.localPlayer.getPosition()),
      t && !0 === t.isolated
        ? this._openIsolatedTab(t)
        : (this._showAllNavTabs(),
          null == this._activeTab
            ? this._showTab("plants")
            : this._populate(this._activeTab)),
      this.app.fire("ui:inventory:open");
  }),
  (InventoryScreen.prototype._onClose = function () {
    this.app.fire("ui:inventory:close"),
      this.app.globals.outfitWasChanged &&
        (this.app.fire("outfit:transmit"),
        (this.app.globals.outfitWasChanged = !1));
  }),
  (InventoryScreen.prototype._showTab = function (t) {
    (this.itemInfoPanel.enabled = !1), this.app.fire("sound:pop:pitch1.5");
    for (let e in this.tabs) {
      const n = this.tabs[e];
      n.name === t
        ? ((n.button.element.color = this._tabActiveColor),
          (n.scrollview.enabled = !0),
          (this._activeTab = n),
          this._populate(n))
        : ((n.button.element.color = this._tabInactiveColor),
          (n.scrollview.enabled = !1),
          (n.noItemsMessage.enabled = !1),
          n.shopTeleportButton && (n.shopTeleportButton.enabled = !1));
    }
  }),
  (InventoryScreen.prototype._onInventoryUpdated = function (t) {
    this._activeTab && this._populate(this._activeTab);
  }),
  (InventoryScreen.prototype._populate = function (t) {
    const e = this.app.globals.localInventory.items;
    this._clearScrollview(t.scrollviewContent),
      (this.itemInfoPanel.enabled = !1);
    const n = e[t.name];
    if (n.length <= 0)
      (t.noItemsMessage.enabled = !0),
        t.shopTeleportButton && (t.shopTeleportButton.enabled = !0);
    else {
      (t.noItemsMessage.enabled = !1),
        t.shopTeleportButton && (t.shopTeleportButton.enabled = !1);
      let e = !1;
      if (t.dequipButton) {
        const e = t.dequipButton.resource.instantiate();
        t.scrollviewContent.addChild(e),
          e.button.on("click", this._dequipInventoryItem.bind(this));
      }
      for (let o in n) {
        const i = n[o],
          a = this.app.gardenDb.getItem(i.id);
        if (a) {
          const n = this.inventoryItemUiTemplate.resource.instantiate();
          t.scrollviewContent.addChild(n),
            (n.gardenItem = a),
            (a.inventoryQuantity = i.quantity || 1),
            (n.element.spriteAsset = a.sprite),
            (n.findByName("quantity").element.text =
              "x" + i.quantity.toLocaleString()),
            n.button.on("click", () => {
              !1 === this.app.tracking.equippedPlant &&
                ((this.app.tracking.equippedPlant = !0),
                this.app.fire("watcher:track", "first_plant_equipped")),
                this._selectInventoryItem(n, a);
            }),
            this._lastSelectedItemId == i.id &&
              (this._selectInventoryItem(n, a), (e = !0));
        }
      }
      if (
        !1 === e &&
        null == t.dequipButton &&
        t.scrollviewContent.children.length > 0
      ) {
        const e = t.scrollviewContent.children[0];
        this._selectInventoryItem(e, e.gardenItem);
      }
    }
  }),
  (InventoryScreen.prototype._clearScrollview = function (t) {
    for (; t.children.length > 0; ) {
      let e = t.children[0];
      e.button.off("click", this._selectInventoryItem, this),
        t.removeChild(e),
        e.destroy();
    }
  }),
  (InventoryScreen.prototype._selectInventoryItem = function (t, e) {
    console.log("Inventory item clicked:", e),
      (this._lastSelectedItemId = e.id),
      (this.itemInfoPanel.enabled = !0),
      this.itemInfoPanel.script.inventoryItemInfoPanel.setGardenItem(e),
      this._activeTab.scrollviewContent.children.forEach((t) => {
        t.element.color = this._unSelectedItemColor;
      }),
      (t.element.color = this._selectedItemColor),
      this._equipInventoryItem(e),
      this.app.fire("sound:pop:pitch1.5");
  }),
  (InventoryScreen.prototype._equipInventoryItem = function (t) {
    const e = t.entity.script.plant;
    e && this.app.globals.localInventory.equipItem(e.handheldDbItem.name);
  }),
  (InventoryScreen.prototype._dequipInventoryItem = function () {
    (this.itemInfoPanel.enabled = !1),
      this.app.globals.localInventory.dequipItem();
  }),
  (InventoryScreen.prototype._openIsolatedTab = function (t) {
    console.log("Opening isolated tab: " + t.tabName),
      this._showOnlyNavTab(t.tabName),
      this._showTab(t.tabName);
  }),
  (InventoryScreen.prototype._showAllNavTabs = function () {
    for (let t in this.tabs) {
      let e = this.tabs[t];
      (e.button.enabled = !0),
        (e.button.element.anchor = this.tabNavAnchors[t]);
    }
  }),
  (InventoryScreen.prototype._showOnlyNavTab = function (t) {
    for (let e in this.tabs) {
      const n = this.tabs[e];
      n.name == t
        ? ((n.button.enabled = !0),
          (n.button.element.anchor = this.tabNavAnchors[0]))
        : (n.button.enabled = !1);
    }
  }),
  (InventoryScreen.prototype._teleportToShop = function (t) {
    this.app.fire("garden:teleport:" + t),
      this.app.screenSystem.closeScreen("inventory");
  });
var WorldButton = pc.createScript("worldButton");
WorldButton.attributes.add("uiButton", { type: "entity" }),
  WorldButton.attributes.add("uiButtonText", { type: "entity" }),
  (WorldButton.prototype.initialize = function () {
    (this._isVisible = !1),
      (this._markerPos = new pc.Vec3()),
      (this._screenPos = new pc.Vec3()),
      (this._activeMarkerScript = null),
      this.uiButton.button.on(
        "click",
        function () {
          this.uiButton.script.pulse.start(),
            this._activeMarkerScript &&
              this._activeMarkerScript.fire("button:clicked"),
            this.app.fire("sound:pop:pitch1");
        },
        this
      );
  }),
  (WorldButton.prototype.isVisible = function () {
    return this._isVisible;
  }),
  (WorldButton.prototype.isBlocked = function () {
    return !!this._activeMarkerScript && this._activeMarkerScript.isBlocked();
  }),
  (WorldButton.prototype.show = function (t) {
    (this._activeMarkerScript = t),
      this._activeMarkerScript.fire("marker:show"),
      this._activeMarkerScript.on("text:updated", this._updateText, this),
      (this._isVisible = !0),
      (this.uiButtonText.element.text = this.app.i18n.getText(
        t.buttonText,
        this.app.i18n.locale
      )),
      this.uiButton.script.pulse.start(),
      this._markerPos.copy(t.entity.getPosition());
  }),
  (WorldButton.prototype.hide = function () {
    (this._isVisible = !1),
      (this.uiButton.enabled = !1),
      this._activeMarkerScript &&
        (this._activeMarkerScript.fire("marker:hide"),
        this._activeMarkerScript.off("text:updated", this._updateText, this),
        (this._activeMarkerScript = null));
  }),
  (WorldButton.prototype.isShowingMarker = function (t) {
    return (
      this._activeMarkerScript &&
      this._activeMarkerScript.entity.getGuid() === t
    );
  }),
  (WorldButton.prototype.update = function (t) {
    if (!this._isVisible) return;
    let i = this._screenPos;
    if (
      (this.app.camera.entity.camera.worldToScreen(this._markerPos, i), i.z > 0)
    ) {
      this.uiButton.enabled = !0;
      const t = this.app.graphicsDevice.maxPixelRatio;
      (i.x *= t), (i.y *= t);
      const e = this.app.graphicsDevice;
      this.uiButton.setPosition(
        (i.x / e.width) * 2 - 1,
        2 * (1 - i.y / e.height) - 1,
        0
      );
    } else this.uiButton.enabled = !1;
  }),
  (WorldButton.prototype._updateText = function (t) {
    this._isVisible &&
      (this.uiButtonText.element.text = this.app.i18n.getText(
        t,
        this.app.i18n.locale
      ));
  });
var WorldButtonSystem = pc.createScript("worldButtonSystem");
WorldButtonSystem.attributes.add("worldButton", {
  type: "entity",
  description: "The entity with the world button script",
}),
  WorldButtonSystem.attributes.add("worldButtonText", {
    type: "entity",
    description: "The text element on the world button",
  }),
  WorldButtonSystem.attributes.add("updateIntervalS", {
    type: "number",
    default: 0.2,
  }),
  WorldButtonSystem.attributes.add("markers", {
    type: "entity",
    array: !0,
    description:
      "Entities with worldButtonMarkerScripts must be added to this array to appear in game",
  }),
  (WorldButtonSystem.prototype.initialize = function () {
    (this.app.worldButtonSystem = this),
      (this._worldButtonCountdownS = this.updateIntervalS),
      (this._worldButtonScript = this.worldButton.script.worldButton);
  }),
  (WorldButtonSystem.prototype.update = function (t) {
    (this._worldButtonCountdownS -= t),
      this._worldButtonCountdownS <= 0 &&
        (this._checkWorldButtonMarkerCollisions(),
        (this._worldButtonCountdownS = this.updateIntervalS));
  }),
  (WorldButtonSystem.prototype._checkWorldButtonMarkerCollisions = function () {
    const t = this._getClosestWorldButtonMarker();
    if (null == t)
      this._worldButtonScript.isVisible() && this._worldButtonScript.hide();
    else {
      const o = t.entity.getGuid();
      if (this._worldButtonScript.isShowingMarker(o)) return;
      !1 === this._worldButtonScript.isShowingMarker(o)
        ? (this._worldButtonScript.hide(), this._worldButtonScript.show(t))
        : this._worldButtonScript.show(t);
    }
  }),
  (WorldButtonSystem.prototype._getClosestWorldButtonMarker = function () {
    let t = null,
      o = 1 / 0;
    const r = this.app.globals.localPlayer.getPosition();
    return (
      this.markers.forEach((e) => {
        if (e) {
          const i = e.script.worldButtonMarker;
          if (i.isDisabled() || i.isBlocked() || !1 === e.enabled) return;
          const n = e.getPosition(),
            s = n.x - r.x,
            d = n.z - r.z,
            l = s * s + d * d,
            u = i.activationDistance;
          l < o && l < u * u && ((o = l), (t = i));
        }
      }),
      t
    );
  }),
  (WorldButtonSystem.prototype.show = function () {
    this._checkWorldButtonMarkerCollisions(), (this.worldButton.enabled = !0);
  }),
  (WorldButtonSystem.prototype.hide = function () {
    this.worldButton.enabled = !1;
  });
var StationSystem = pc.createScript("stationSystem");
StationSystem.attributes.add("closeButton", { type: "entity" }),
  StationSystem.attributes.add("stationGroups", { type: "entity", array: !0 }),
  (StationSystem.prototype.initialize = function () {
    (this.app.stationSystem = this), (this._activeStation = null);
  }),
  (StationSystem.prototype.getStationByName = function (t) {
    for (let e in this.stationGroups) {
      const i = this.stationGroups[e];
      for (let e in i.children) {
        const n = i.children[e];
        if (n.name == t) return n.script.station;
      }
    }
    return null;
  }),
  (StationSystem.prototype.activate = function (t) {
    (this._activeStation = t),
      (this.closeButton.enabled = !0),
      this.app.screenSystem.openScreen("station"),
      t.setStationActive();
  }),
  (StationSystem.prototype.deactivate = function () {
    this._activeStation &&
      (this._activeStation.reset(), (this._activeStation = null)),
      (this.closeButton.enabled = !1),
      this.app.screenSystem.closeScreen("station");
  });
var ShopUiItem = pc.createScript("shopUiItem");
ShopUiItem.attributes.add("displayName", { type: "entity" }),
  ShopUiItem.attributes.add("image", { type: "entity" }),
  ShopUiItem.attributes.add("normalPrice", { type: "entity" }),
  ShopUiItem.attributes.add("vipPrice", { type: "entity" }),
  ShopUiItem.attributes.add("normalStarIcon", { type: "entity" }),
  ShopUiItem.attributes.add("vipStarIcon", { type: "entity" }),
  ShopUiItem.attributes.add("inStockLabel", { type: "entity" }),
  ShopUiItem.attributes.add("strikethrough", { type: "entity" }),
  ShopUiItem.attributes.add("outOfStockLabel", { type: "entity" }),
  ShopUiItem.attributes.add("inInventoryLabel", { type: "entity" }),
  ShopUiItem.attributes.add("buyButton", { type: "entity" }),
  ShopUiItem.attributes.add("watchAdButton", { type: "entity" }),
  ShopUiItem.attributes.add("closedHeight", { type: "number", default: 72 }),
  ShopUiItem.attributes.add("openedHeight", { type: "number", default: 130 }),
  ShopUiItem.attributes.add("openCloseDurationS", {
    type: "number",
    default: 0.25,
  }),
  (ShopUiItem.prototype.initialize = function () {
    (this._isOpen = !1),
      (this._openCloseCountdownS = 0),
      (this._targetHeight = this.closedHeight),
      (this._gardenDbItem = null),
      (this._price = 0),
      (this._defaultBuyPulseTime = this.buyButton.script.pulse.pulseTime),
      this.entity.button.on("click", this._onClick, this),
      this.buyButton.button.on("click", this._onBuyClick, this),
      this.watchAdButton.button.on("click", this._onWatchAdClick, this),
      this.on(
        "destroy",
        function () {
          this.entity.button.off("click", this._onClick, this),
            this.buyButton.button.off("click", this._onBuyClick, this),
            this.watchAdButton.button.off("click", this._onWatchAdClick, this);
        },
        this
      );
  }),
  (ShopUiItem.prototype._onClick = function () {
    0 == this._isOpen && this.open(),
      this.app.fire("garden:shopUiItem:click", this.entity),
      this._updateListeners();
  }),
  (ShopUiItem.prototype._updateListeners = function () {
    const t = "garden:" + this.type + ":stock:update";
    this.app.hasEvent(t) && this.app.off(t, this._onStockUpdate, this),
      this.app.on(t, this._onStockUpdate, this);
  }),
  (ShopUiItem.prototype.open = function () {
    (this._isOpen = !0),
      (this.buyButton.enabled = !0),
      (this.watchAdButton.enabled = this._gardenDbItem.buyPrice > 0),
      (this._targetHeight = this.openedHeight),
      (this._openCloseCountdownS = this.openCloseDurationS),
      this._showStock();
  }),
  (ShopUiItem.prototype.close = function () {
    (this._isOpen = !1),
      (this.buyButton.enabled = !1),
      (this.watchAdButton.enabled = !1),
      (this.outOfStockLabel.enabled = !1),
      (this._targetHeight = this.closedHeight),
      (this._openCloseCountdownS = this.openCloseDurationS);
  }),
  (ShopUiItem.prototype.isOpen = function () {
    return this._isOpen;
  }),
  (ShopUiItem.prototype.getHeight = function () {
    return this._targetHeight;
  }),
  (ShopUiItem.prototype.getPrice = function () {
    return this._price;
  }),
  (ShopUiItem.prototype.highlightBuyButton = function () {
    (this.buyButton.script.pulse.continuous = !0),
      (this.buyButton.script.pulse.pulseTime = 3 * this._defaultBuyPulseTime),
      this.buyButton.script.pulse.start();
  }),
  (ShopUiItem.prototype.setGardenDbItem = function (t) {
    t.entity.script.seed
      ? (this.type = "seed")
      : t.entity.script.potion && (this.type = "potion"),
      (this._gardenDbItem = t),
      (this.itemId = t.id),
      (this.displayName.element.text = this.app.i18n.getText(
        t.displayName,
        this.app.i18n.locale
      )),
      (this.image.element.spriteAsset = t.sprite),
      (this.normalPrice.element.text = t.buyPrice.toLocaleString()),
      this.app.vipRoom.hasAccess() && t.buyPrice > 0
        ? ((this.strikethrough.enabled = !0),
          (this.normalPrice.element.opacity = 0.5),
          (this.normalStarIcon.element.opacity = 0.5),
          (this.vipPrice.enabled = !0),
          (this.vipPrice.element.text = this.app.gardening
            .getVIPPrice(t.buyPrice)
            .toLocaleString()),
          (this.vipStarIcon.enabled = !0))
        : ((this.strikethrough.enabled = !1),
          (this.normalPrice.element.opacity = 1),
          (this.normalStarIcon.element.opacity = 1),
          (this.vipPrice.enabled = !1),
          (this.vipStarIcon.enabled = !1)),
      this._showStock();
  }),
  (ShopUiItem.prototype._showStock = function () {
    const t = this.app.gardenDb.getItem(this.itemId);
    (this.inStockLabel.element.text =
      this.app.i18n.getText("In stock: ", this.app.i18n.locale) +
      t.numInStock.toLocaleString()),
      t.numInStock <= 0
        ? ((this.buyButton.enabled = !1),
          (this.watchAdButton.enabled = !1),
          (this.outOfStockLabel.enabled = !0),
          (this.outOfStockLabel.element.text = this.app.i18n.getText(
            "Out of stock",
            this.app.i18n.locale
          )))
        : (this.outOfStockLabel.enabled = !1);
    const e = this.app.globals.localInventory.getItemCount(
      this.type + "s",
      this.itemId
    );
    (this.inInventoryLabel.element.text =
      this.app.i18n.getText("You have: ", this.app.i18n.locale) +
      e.toLocaleString()),
      (this._price = t.buyPrice),
      this.app.vipRoom.hasAccess() &&
        (this._price = this.app.gardening.getVIPPrice(this._price)),
      this._updateBuyButtonState();
  }),
  (ShopUiItem.prototype._updateBuyButtonState = function () {
    let t = this.buyButton;
    this.app.globals.starCount < this._price
      ? ((t.element.opacity = 0.5),
        (t.button.hoverTint.a = 0.5),
        (t.button.pressedTint.a = 0.5),
        (t.findByName("text").element.opacity = 0.5))
      : ((t.element.opacity = 1),
        (t.button.hoverTint.a = 1),
        (t.button.pressedTint.a = 1),
        (t.findByName("text").element.opacity = 1));
  }),
  (ShopUiItem.prototype.update = function (t) {
    if (this._openCloseCountdownS > 0) {
      (this._openCloseCountdownS -= t),
        this._openCloseCountdownS <= 0 && (this._openCloseCountdownS = 0);
      const e = 1 - this._openCloseCountdownS / this.openCloseDurationS;
      this.entity.element.height = pc.math.lerp(
        this.entity.element.height,
        this._targetHeight,
        e
      );
    }
  }),
  (ShopUiItem.prototype._onBuyClick = function () {
    (this.buyButton.script.pulse.continuous = !1),
      (this.buyButton.script.pulse.pulseTime = this._defaultBuyPulseTime),
      this.buyButton.script.pulse.start(),
      this.app.once("garden:" + this.type + ":stock:update", () => {
        this.app.effects.addUiEffect(
          "sparkles-outward",
          { x: 0, y: 0, z: 0 },
          { attachTo: this.buyButton }
        );
      }),
      this.app.fire("garden:" + this.type + ":purchase:attempt", this.itemId),
      this.app.fire("upwardTone"),
      this._updateBuyButtonState();
  }),
  (ShopUiItem.prototype._onWatchAdClick = function () {
    this.watchAdButton.script.pulse.start(),
      this.app.fire("garden:" + this.type + ":adUnlock:attempt", this.itemId);
  }),
  (ShopUiItem.prototype._onStockUpdate = function (t) {
    t === this.itemId && this._showStock();
  });
var ShopUi = pc.createScript("shopUi");
ShopUi.attributes.add("stationName", {
  type: "string",
  description: "Will be sent when shop's station:enter is fired",
}),
  ShopUi.attributes.add("starUI", { type: "entity" }),
  ShopUi.attributes.add("restockButton", { type: "entity" }),
  ShopUi.attributes.add("restockTimerLabel", { type: "entity" }),
  ShopUi.attributes.add("shopUiItemTemplate", {
    type: "asset",
    assetType: "template",
  }),
  ShopUi.attributes.add("shopItemContent", { type: "entity" }),
  ShopUi.attributes.add("scrollView", {
    type: "entity",
    description: "The top-level parent scroll view element",
  }),
  ShopUi.attributes.add("vipBanner", {
    type: "entity",
    description: "The VIP banner shown when VIP discount is active",
  }),
  (ShopUi.prototype.initialize = function () {
    (this.screen = this.entity.script.screen),
      (this._shopItemYSpacing = 5),
      (this._isPopulated = !1),
      this.app.on("vip:access:expired", this._updateUiItems, this),
      this.restockButton.button.on("click", this._attemptRestock, this),
      this.app.on("garden:shopUiItem:click", this._collapseContent, this),
      this.app.on("garden:seeds:restocked", this._updateUiItems, this),
      this.app.on("garden:potions:restocked", this._updateUiItems, this);
  }),
  (ShopUi.prototype.isPopulated = function () {
    return this._isPopulated;
  }),
  (ShopUi.prototype.populate = function (t) {
    let e = 0;
    for (let i in t) {
      const s = t[i],
        o = this.shopUiItemTemplate.resource.instantiate();
      this.shopItemContent.addChild(o),
        o.script.shopUiItem.setGardenDbItem(s),
        (e += o.element.height + 2 * this._shopItemYSpacing);
    }
    (this.shopItemContent.element.height = e), (this._isPopulated = !0);
  }),
  (ShopUi.prototype.open = function () {
    this.app.fire("station:enter", "seeds"),
      (this.starUI.enabled = !0),
      this.app.fire("longChimes"),
      this._updateUiItems(),
      this.shopItemContent.setLocalPosition(0, 0, 0),
      this._showBuyHint();
  }),
  (ShopUi.prototype.close = function () {
    (this.starUI.enabled = !1), this.app.fire("station:exit");
  }),
  (ShopUi.prototype._showBuyHint = function () {
    if (this.app.globals.localInventory.getItemCount(this.stationName) <= 0) {
      const t = this.shopItemContent.children[0].script.shopUiItem;
      t.getPrice() <= 0 && (t.open(), t.highlightBuyButton());
    }
  }),
  (ShopUi.prototype.update = function (t) {
    if (this.screen.isOpen()) {
      const t = this.app.gardenDb.getTimeMsUntilRestock();
      (this.restockTimerLabel.element.text =
        this.app.i18n.getText("Next restock in ", this.app.i18n.locale) +
        window.formatTimeS(t / 1e3)),
        t < 6e4 && (this.restockTimerLabel.element.text += "s");
    }
  }),
  (ShopUi.prototype._updateUiItems = function () {
    for (let t = 0; t < this.shopItemContent.children.length; t++) {
      let e = this.shopItemContent.children[t],
        i = e.script.shopUiItem;
      if (e.script && e.script.shopUiItem && i.itemId) {
        const t = this.app.gardenDb.getItem(i.itemId);
        i.setGardenDbItem(t);
      }
    }
    this.app.vipRoom.hasAccess()
      ? ((this.vipBanner.enabled = !0),
        (this.scrollView.element.anchor = [0, 0.02, 1, 0.71]))
      : ((this.vipBanner.enabled = !1),
        (this.scrollView.element.anchor = [0, 0.02, 1, 0.83])),
      this._collapseContent();
  }),
  (ShopUi.prototype._collapseContent = function (t = null) {
    for (let e = 0; e < this.shopItemContent.children.length; e++) {
      let i = this.shopItemContent.children[e];
      (t && i._guid == t._guid) || i.script.shopUiItem.close();
    }
    this._updateScrollViewHeight();
  }),
  (ShopUi.prototype._updateScrollViewHeight = function () {
    let t = 0;
    for (let e = 0; e < this.shopItemContent.children.length; e++) {
      t +=
        this.shopItemContent.children[e].script.shopUiItem.getHeight() +
        2 * this._shopItemYSpacing;
    }
    this.shopItemContent.element.height = t;
  }),
  (ShopUi.prototype._attemptRestock = function () {
    this.app.fire("garden:adRestock:" + this.stationName);
  });
var SeedScreen = pc.createScript("seedScreen");
(SeedScreen.prototype.initialize = function () {
  (this.shopUi = this.entity.script.shopUi),
    this.entity.on("screen:onOpen", this._onOpen, this),
    this.entity.on("screen:onClose", this._onClose, this);
}),
  (SeedScreen.prototype._onOpen = function () {
    !1 === this.shopUi.isPopulated() &&
      this.shopUi.populate(this.app.gardenDb.seeds),
      !1 === this.app.tracking.openedSeedShop &&
        ((this.app.tracking.openedSeedShop = !0),
        this.app.fire("watcher:track", "first_seed_shop_open")),
      this.shopUi.open();
  }),
  (SeedScreen.prototype._onClose = function () {
    this.shopUi.close();
  });
var Seed = pc.createScript("seed");
Seed.attributes.add("id", {
  type: "string",
  description: "Must be unique, prefix with seed_",
}),
  Seed.attributes.add("displayName", {
    type: "string",
    description: "Name displayed on the UI, also the localization key",
  }),
  Seed.attributes.add("buyPrice", { type: "number", default: 1 }),
  Seed.attributes.add("sprite", { type: "asset", assetType: "sprite" }),
  Seed.attributes.add("variants", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "plant",
        type: "entity",
        description: "The gardenDb entity with the plant script attached",
      },
      {
        name: "growthChance",
        type: "number",
        default: 0.2,
        description:
          "Decimal percentage chance of this plant growing, 0.2 = 20%",
      },
    ],
  }),
  (Seed.prototype.initialize = function () {}),
  (Seed.prototype.getRandomVariant = function () {
    const e = this.variants.reduce((e, t) => e + t.growthChance, 0);
    let t = Math.random() * e;
    for (let e = 0; e < this.variants.length; e++) {
      const a = this.variants[e];
      if (t < a.growthChance) return a.plant.script.plant;
      t -= a.growthChance;
    }
    return null;
  });
var PotionScreen = pc.createScript("potionScreen");
(PotionScreen.prototype.initialize = function () {
  (this.shopUi = this.entity.script.shopUi),
    this.entity.on("screen:onOpen", this._onOpen, this),
    this.entity.on("screen:onClose", this._onClose, this);
}),
  (PotionScreen.prototype._onOpen = function () {
    !1 === this.shopUi.isPopulated() &&
      this.shopUi.populate(this.app.gardenDb.potions),
      !1 === this.app.tracking.openedPotionShop &&
        ((this.app.tracking.openedPotionShop = !0),
        this.app.fire("watcher:track", "first_potion_shop_open")),
      this.shopUi.open();
  }),
  (PotionScreen.prototype._onClose = function () {
    this.shopUi.close();
  });
var Potion = pc.createScript("potion");
Potion.attributes.add("id", {
  type: "string",
  description: "Must be unique, prefix with potion_",
}),
  Potion.attributes.add("displayName", {
    type: "string",
    description: "Name displayed on the UI, also the localization key",
  }),
  Potion.attributes.add("buyPrice", { type: "number", default: 1 }),
  Potion.attributes.add("sprite", { type: "asset", assetType: "sprite" }),
  Potion.attributes.add("growthSpeedBoost", { type: "number", default: 2 }),
  (Potion.prototype.initialize = function () {});
var PlantCareScreen = pc.createScript("plantCareScreen");
PlantCareScreen.attributes.add("growthInfo", {
  type: "entity",
  description: "The main group panel",
}),
  PlantCareScreen.attributes.add("plantName", { type: "entity" }),
  PlantCareScreen.attributes.add("grownValue", { type: "entity" }),
  PlantCareScreen.attributes.add("readyInValue", { type: "entity" }),
  PlantCareScreen.attributes.add("wateredBox", { type: "entity" }),
  PlantCareScreen.attributes.add("wateredText", { type: "entity" }),
  PlantCareScreen.attributes.add("potionIcon", { type: "entity" }),
  PlantCareScreen.attributes.add("potionName", { type: "entity" }),
  PlantCareScreen.attributes.add("clearButton", { type: "entity" }),
  PlantCareScreen.attributes.add("addPotionButton", { type: "entity" }),
  PlantCareScreen.attributes.add("potionScrollview", { type: "entity" }),
  PlantCareScreen.attributes.add("noPotionsPanel", { type: "entity" }),
  PlantCareScreen.attributes.add("potionStoreButton", { type: "entity" }),
  PlantCareScreen.attributes.add("potionScrollviewContent", { type: "entity" }),
  PlantCareScreen.attributes.add("carePotionTemplate", {
    type: "asset",
    assetType: "template",
  }),
  PlantCareScreen.attributes.add("defaultPotionIcon", {
    type: "asset",
    assetType: "sprite",
  }),
  PlantCareScreen.attributes.add("clearConfirmPanel", {
    type: "entity",
    description: "Shown before clearing a plant",
  }),
  PlantCareScreen.attributes.add("confirmClearButton", { type: "entity" }),
  PlantCareScreen.attributes.add("confirmCancelButton", { type: "entity" }),
  (PlantCareScreen.prototype.initialize = function () {
    (this._activeGardenPatch = null),
      (this._activeColor = new pc.Color(0.738, 0.906, 0.977, 1)),
      (this._inactiveColor = new pc.Color(0.98, 0.91, 0.64, 1)),
      this.addPotionButton.button.on("click", this._openPotions, this),
      this.potionStoreButton.button.on(
        "click",
        () => {
          this.app.fire("garden:teleport:potions"),
            this.app.screenSystem.closeScreen("plantCare");
        },
        this
      ),
      this.clearButton.button.on("click", this._showClearConfirm, this),
      this.confirmClearButton.button.on("click", this._clearPlant, this),
      this.confirmCancelButton.button.on("click", this._hideClearConfirm, this),
      this.entity.on("screen:onOpen", this._onOpen, this),
      this.entity.on("screen:onClose", this._onClose, this);
  }),
  (PlantCareScreen.prototype._onOpen = function (t) {
    console.log("plant care on open, gardenPatch:", t.gardenPatch),
      t.gardenPatch &&
        ((this.growthInfo.enabled = !0),
        (this.clearButton.enabled = !0),
        (this.clearConfirmPanel.enabled = !1),
        (this._activeGardenPatch = t.gardenPatch),
        (this.plantName.element.text = this.app.i18n.getText(
          t.gardenPatch.getActivePlant().seedName,
          this.app.i18n.locale
        )),
        (this.potionScrollview.enabled = !1),
        (this.noPotionsPanel.enabled = !1),
        this.app.fire("station:enter", "care"),
        this.app.fire("longChimes"));
  }),
  (PlantCareScreen.prototype._onClose = function () {
    this.app.fire("station:exit");
  }),
  (PlantCareScreen.prototype.update = function (t) {
    const e = this._activeGardenPatch;
    this.entity.script.screen.isOpen() && e && this._updateValues(e);
  }),
  (PlantCareScreen.prototype._updateValues = function (t) {
    const e = t.getActivePlant();
    if (e)
      if (e.growTimeLeftS > 0) {
        const n =
          Math.floor(100 - (e.growTimeLeftS / e.totalGrowTimeS) * 100) + "%";
        this.grownValue.element.text = n;
        let a = this.app.timers.formatTime(1e3 * e.growTimeLeftS);
        e.growTimeLeftS < 60 && (a += "s"),
          (this.readyInValue.element.text = a),
          t.isWatered()
            ? ((this.wateredBox.element.color = this._activeColor),
              (this.wateredText.element.text =
                "2x " + this.app.i18n.getText("Speed", this.app.i18n.locale)))
            : ((this.wateredBox.element.color = this._inactiveColor),
              (this.wateredText.element.text = this.app.i18n.getText(
                "Dry",
                this.app.i18n.locale
              )));
        const i = t.getPotionId();
        if (i.length > 0) {
          const t = this.app.gardenDb.getItem(i);
          t &&
            ((this.potionIcon.element.spriteAsset = t.sprite),
            (this.potionName.element.text = this.app.i18n.getText(
              t.displayName,
              this.app.i18n.locale
            ))),
            (this.addPotionButton.enabled = !1);
        } else
          (this.potionIcon.element.spriteAsset = this.defaultPotionIcon),
            (this.potionName.element.text = this.app.i18n.getText(
              "None",
              this.app.i18n.locale
            )),
            0 == this.potionScrollview.enabled &&
              0 == this.noPotionsPanel.enabled &&
              (this.addPotionButton.enabled = !0);
      } else this.app.screenSystem.closeScreen("plantCare");
  }),
  (PlantCareScreen.prototype._openPotions = function () {
    (this.addPotionButton.enabled = !1), (this.clearButton.enabled = !1);
    let t = this.app.globals.localInventory.items.potions;
    if ((this.app.fire("sound:pop:pitch1.5"), t.length <= 0))
      (this.noPotionsPanel.enabled = !0), (this.potionScrollview.enabled = !1);
    else {
      (this.noPotionsPanel.enabled = !1),
        (this.potionScrollview.enabled = !0),
        this._clearScrollview();
      let e = this.potionScrollviewContent;
      t = t.sort((t, e) => t.id.localeCompare(e.id));
      let n = 0;
      for (let a in t) {
        let i = t[a];
        const o = this.app.gardenDb.getItem(i.id);
        let r = this.carePotionTemplate.resource.instantiate();
        (r.findByName("image").element.spriteAsset = o.sprite),
          (r.findByName("displayName").element.text = this.app.i18n.getText(
            o.displayName,
            this.app.i18n.locale
          )),
          (r.findByName("inInventory").element.text =
            this.app.i18n.getText("You have: ", this.app.i18n.locale) +
            i.quantity),
          r
            .findByName("useButton")
            .button.on("click", this._usePotion.bind(this, i.id), this),
          e.addChild(r),
          (n += r.element.height + 10);
      }
      e.element.height = n;
    }
  }),
  (PlantCareScreen.prototype._clearScrollview = function () {
    let t = this.potionScrollviewContent;
    for (; t.children.length > 0; ) {
      let e = t.children[0];
      e.findByName("useButton").button.off("click"),
        t.removeChild(e),
        e.destroy();
    }
  }),
  (PlantCareScreen.prototype._usePotion = function (t) {
    this.app.fire("upwardTone"),
      this._activeGardenPatch &&
        this._activeGardenPatch.hasActivePlant() &&
        (this.app.globals.localInventory.withdrawPotion(t) &&
          (this._activeGardenPatch.usePotion(t),
          (this.potionScrollview.enabled = !1),
          (this.addPotionButton.enabled = !1)),
        console.log("this.activeGardenPatch", this._activeGardenPatch));
  }),
  (PlantCareScreen.prototype._showClearConfirm = function () {
    (this.growthInfo.enabled = !1), (this.clearConfirmPanel.enabled = !0);
  }),
  (PlantCareScreen.prototype._hideClearConfirm = function () {
    (this.growthInfo.enabled = !0),
      (this.clearConfirmPanel.enabled = !1),
      (this.potionScrollview.enabled = !1),
      (this.noPotionsPanel.enabled = !1);
  }),
  (PlantCareScreen.prototype._clearPlant = function () {
    this._activeGardenPatch && this._activeGardenPatch.clearActivePlant(),
      this.app.screenSystem.closeScreen("plantCare");
  });
var Plant = pc.createScript("plant");
Plant.attributes.add("id", {
  type: "string",
  description: "Must be unique, prefix with plant_",
}),
  Plant.attributes.add("displayName", {
    type: "string",
    description: "Name displayed on the UI, also the localization key",
  }),
  Plant.attributes.add("growTimeS", { type: "number", default: 30 }),
  Plant.attributes.add("sellPrice", { type: "number", default: 1 }),
  Plant.attributes.add("allowCare", { type: "boolean", default: !0 }),
  Plant.attributes.add("rarity", {
    type: "number",
    default: 0,
    enum: [
      { common: 0 },
      { uncommon: 1 },
      { rare: 2 },
      { epic: 3 },
      { legendary: 4 },
      { mythic: 5 },
      { ascendant: 6 },
      { divine: 7 },
      { celestial: 8 },
      { eternal: 9 },
    ],
  }),
  Plant.attributes.add("sprite", { type: "asset", assetType: "sprite" }),
  Plant.attributes.add("template", {
    type: "asset",
    assetType: "template",
    description:
      "The template with the growing and final plant meshes as well as the growable script.",
  }),
  Plant.attributes.add("material", {
    type: "asset",
    assetType: "material",
    description:
      "Set the color of the fully grown plant by changing this material.",
  }),
  Plant.attributes.add("handheldDbItem", {
    type: "entity",
    description: "Once grown this is the item that player can equip.",
  }),
  Plant.attributes.add("playerEffect", {
    type: "number",
    default: 0,
    enum: [{ none: 0 }, { spriteSheet: 1 }, { animSpeed: 2 }, { boneScale: 3 }],
  }),
  Plant.attributes.add("effectSprite", {
    type: "asset",
    assetType: "sprite",
    name: "spriteAnimation",
  }),
  Plant.attributes.add("animSpeed", {
    type: "number",
    default: 1,
    description: "(Optional) Anim speed multiplier for animSpeed player effect",
  }),
  Plant.attributes.add("boneScale", {
    type: "json",
    array: !0,
    description: "(Optional) Bone scale factors for boneScale player effect",
    schema: [
      {
        name: "boneName",
        type: "string",
        description: "The name of the bone as it appears in the metarig",
      },
      {
        name: "scale",
        type: "vec3",
        default: [1, 1, 1],
        description: "The scale factor for each axis of the bone",
      },
    ],
  }),
  (Plant.prototype.initialize = function () {});
var HarvestScreen = pc.createScript("harvestScreen");
HarvestScreen.attributes.add("growableNameElement", { type: "entity" }),
  HarvestScreen.attributes.add("growableImageElement", { type: "entity" }),
  HarvestScreen.attributes.add("continueButton", { type: "entity" }),
  HarvestScreen.attributes.add("wearNowButton", { type: "entity" }),
  HarvestScreen.attributes.add("inventoryButton", { type: "entity" }),
  (HarvestScreen.prototype.initialize = function () {
    (this._plant = null),
      this.entity.on("screen:onOpen", this._onOpen, this),
      this.entity.on("screen:onClose", this._onClose, this);
  }),
  (HarvestScreen.prototype._onOpen = function (t) {
    this._plant = t.plant;
    const e = this._plant.variant;
    (this.growableNameElement.element.text = this.app.i18n.getText(
      e.displayName,
      this.app.i18n.locale
    )),
      (this.growableImageElement.element.spriteAsset = e.sprite),
      setTimeout(() => {
        this.continueButton.button.on("click", this._onContinue, this),
          this.wearNowButton.button.on("click", this._wearUnlockedItem, this);
      }, 250),
      this.app.fire("station:enter", "harvest"),
      this.app.fire("upwardTone");
  }),
  (HarvestScreen.prototype._onClose = function () {
    this.inventoryButton.script.pulse.start(), this.app.fire("station:exit");
  }),
  (HarvestScreen.prototype._onContinue = function () {
    this.continueButton.button.off("click", this._onContinue, this),
      this.wearNowButton.button.off("click", this._wearUnlockedItem, this),
      this.app.screenSystem.closeScreen("plantHarvest"),
      this.app.fire("sound:pop:pitch1.5");
  }),
  (HarvestScreen.prototype._wearUnlockedItem = function () {
    this.app.globals.localInventory.equipItem(this._plant.variant.entity.name),
      this.continueButton.button.off("click", this._onContinue, this),
      this.wearNowButton.button.off("click", this._wearUnlockedItem, this),
      this.app.screenSystem.closeScreen("plantHarvest"),
      this.app.fire("sound:pop:pitch1.5");
  });
var Growable = pc.createScript("growable");
Growable.attributes.add("scaleCurve", {
  type: "curve",
  curves: ["x", "y", "z"],
}),
  Growable.attributes.add("growing", { type: "entity" }),
  Growable.attributes.add("final", { type: "entity" }),
  (Growable.prototype.initialize = function () {
    (this._startScale = this.entity.getLocalScale().clone()),
      window.setVDynamic(this.growing, !0);
  }),
  (Growable.prototype.setVariant = function (t) {
    let e = this.final.render.meshInstances[1];
    e && (e.material = t.material.resource), (this._variant = t);
  }),
  (Growable.prototype.start = function () {
    this.growing.enabled = !0;
    const t = this.scaleCurve.value(0);
    this.growing.setLocalScale(t[0], t[1], t[2]);
  }),
  (Growable.prototype.showProgress = function (t) {
    const e = this.scaleCurve.value(t);
    this.growing.setLocalScale(e[0], e[1], e[2]);
  }),
  (Growable.prototype.finish = function () {
    (this.growing.enabled = !1),
      this.growing.setLocalScale(0, 0, 0),
      window.setVDynamic(this.final, !0),
      (this.final.enabled = !0),
      this.final.script.pulse.start();
  });
var GardenPatch = pc.createScript("gardenPatch");
GardenPatch.attributes.add("startsLocked", { type: "boolean", default: !1 }),
  GardenPatch.attributes.add("worldButtonMarker", { type: "entity" }),
  GardenPatch.attributes.add("percentageTemplate", {
    type: "asset",
    assetType: "template",
  }),
  GardenPatch.attributes.add("wetRender", { type: "entity" }),
  GardenPatch.attributes.add("potionEffect", { type: "entity" }),
  GardenPatch.attributes.add("sparkleEffect", {
    type: "asset",
    assetType: "template",
  }),
  GardenPatch.attributes.add("cameraSettingsLandscape", {
    type: "json",
    schema: [
      { name: "distance", type: "number", default: 3 },
      { name: "offsetY", type: "number", default: 0.8 },
      { name: "rot", type: "vec3" },
      { name: "fov", type: "number", default: 40 },
    ],
  }),
  GardenPatch.attributes.add("cameraSettingsPortrait", {
    type: "json",
    schema: [
      { name: "distance", type: "number", default: 5 },
      { name: "offsetY", type: "number", default: 0.5 },
      { name: "rot", type: "vec3", default: [-15, 0, 0] },
      { name: "fov", type: "number", default: 40 },
    ],
  }),
  (GardenPatch.prototype.initialize = function () {
    (this._plant = null),
      (this._wasRestored = !1),
      (this._isWatered = !1),
      (this._activeFountain = null),
      (this._potionId = ""),
      (this._plantedAt = 0),
      (this._potionEvents = []),
      (this._waterEvents = []),
      (this.markerScript = this.worldButtonMarker.script.worldButtonMarker),
      this.app.gardening.registerGardenPatch(this.entity.name, this),
      this.markerScript.on(
        "marker:show",
        () => {
          this.markerScript.on("button:clicked", this._onClicked, this);
        },
        this
      ),
      this.markerScript.on(
        "marker:hide",
        () => {
          this.app.gardening.clearActiveGardenPatch(),
            this.markerScript.off("button:clicked", this._onClicked, this);
        },
        this
      ),
      this.app.on("station:enter", this.hideUI, this),
      this.app.on("station:exit", this.showUI, this),
      this.app.on("ui:inventory:open", this.hideUI, this),
      this.app.on("ui:inventory:close", this.showUI, this),
      this.app.once("poki:firstInteraction", this._onStart, this);
  }),
  (GardenPatch.prototype._onStart = function () {
    this._wasRestored ||
      (this.startsLocked && this.markerScript.setBlocked(!0));
  }),
  (GardenPatch.prototype.unlock = function () {
    this.markerScript.setBlocked(!1);
  }),
  (GardenPatch.prototype.hasActivePlant = function () {
    return null !== this._plant;
  }),
  (GardenPatch.prototype.getActivePlant = function () {
    return this._plant;
  }),
  (GardenPatch.prototype.isWatered = function () {
    return this._isWatered;
  }),
  (GardenPatch.prototype.getPotionId = function () {
    return this._potionId;
  }),
  (GardenPatch.prototype.getCameraSettings = function () {
    return "portrait" == this.app.globals.layout
      ? {
          cameraY: this.cameraSettingsPortrait.offsetY,
          cameraRot: this.cameraSettingsPortrait.rot,
          cameraFov: this.cameraSettingsPortrait.fov,
          cameraDistance: this.cameraSettingsPortrait.distance,
        }
      : {
          cameraY:
            this.entity.getPosition().y + this.cameraSettingsLandscape.offsetY,
          cameraRot: this.cameraSettingsLandscape.rot,
          cameraFov: this.cameraSettingsLandscape.fov,
          cameraDistance: this.cameraSettingsLandscape.distance,
        };
  }),
  (GardenPatch.prototype.getSaveData = function () {
    return {
      isLocked: this.markerScript.isBlocked(),
      plantId: this._plant ? this._plant.variant.id : "",
      seedName: this._plant ? this._plant.seedName : "",
      plantedAt: this._plantedAt,
      potionId: this._potionId,
      potionEvents: JSON.stringify(this._potionEvents),
      waterEvents: JSON.stringify(this._waterEvents),
    };
  }),
  (GardenPatch.prototype.restore = function (t) {
    this.markerScript.setBlocked(t.isLocked),
      this.app.afterGroupLoaded("garden", () => {
        if (t.plantId.length > 0) {
          this.clearActivePlant(),
            (this._potionId = t.potionId || ""),
            (this._plantedAt = parseInt(t.plantedAt) || 0),
            (this._potionEvents = t.potionEvents
              ? JSON.parse(t.potionEvents)
              : []),
            (this._waterEvents = t.waterEvents
              ? JSON.parse(t.waterEvents)
              : []);
          const e = this.app.gardenDb.getItem(t.plantId);
          this._createPlant({ variant: e, seedName: t.seedName }),
            this._potionEvents.length > 0 && (this.potionEffect.enabled = !0);
        }
      }),
      (this._wasRestored = !0);
  }),
  (GardenPatch.prototype.playSparkles = function () {
    (this._sparkles = this.sparkleEffect.resource.instantiate()),
      this._sparkles.setLocalPosition(1, 1, -1),
      this.entity.addChild(this._sparkles),
      this._sparkles.script.sparkles.startSparkles(),
      setTimeout(() => {
        this.entity.removeChild(this._sparkles), this._sparkles.destroy();
      }, 3e3);
  }),
  (GardenPatch.prototype._createPlant = function (t) {
    if (!t.variant) return;
    let e = t.variant.template.resource.instantiate();
    e.setLocalPosition(1, 0, -1),
      this.entity.addChild(e),
      (e.variant = t.variant),
      (e.seedName = t.seedName),
      (e.growTimeLeftS = t.variant.growTimeS),
      (e.totalGrowTimeS = e.growTimeLeftS),
      e.script.growable.setVariant(t.variant),
      e.script.growable.start(),
      t.variant.allowCare
        ? this.markerScript.updateText(
            this.app.i18n.getText("Care", this.app.i18n.locale)
          )
        : this.markerScript.setBlocked(!0);
    const a = this.percentageTemplate.resource.instantiate();
    this.entity.addChild(a),
      a.setLocalPosition(1, 0.25, -0.25),
      (e.percentageLabel = a),
      (this._plant = e);
  }),
  (GardenPatch.prototype._onClicked = function () {
    console.log("garden patch button clicked " + this.entity.name),
      (this.app.tracking.numPatchesOpened += 1),
      this.app.fire(
        "watcher:track",
        "num_patches_opened_" + this.app.tracking.numPatchesOpened
      ),
      this.app.gardening.setActiveGardenPatch(this),
      this._plant
        ? this._plant.growTimeLeftS <= 0
          ? (console.log("Harvesting plant:", this._plant),
            this.app.fire("garden:plant:harvest", this._plant),
            this.clearActivePlant(),
            this.app.fire("garden:plant:harvested", this))
          : (console.log("Caring for plant:", this._plant),
            this.app.fire("garden:plant:care", this))
        : (console.log("no active plant, opening inventory to seeds"),
          this.app.fire("garden:seed:pick", this));
  }),
  (GardenPatch.prototype.clearActivePlant = function () {
    if (this._plant) {
      let t = this._plant.percentageLabel;
      t && (this._plant.removeChild(t), t.destroy()),
        this.entity.removeChild(this._plant),
        this._plant.destroy(),
        (this._plant = null),
        this.markerScript.updateText(
          this.app.i18n.getText("Plant", this.app.i18n.locale)
        );
    }
    (this._potionId = ""),
      (this._plantedAt = 0),
      (this._potionEvents = []),
      (this._waterEvents = []),
      (this.potionEffect.enabled = !1);
  }),
  (GardenPatch.prototype.plantSeed = function (t) {
    null === this._plant &&
      (console.log("Planting seed:", t),
      this._createPlant({
        variant: t.getRandomVariant(),
        seedName: t.displayName,
      }),
      (this._plantedAt = Date.now()),
      (this._potionId = ""),
      (this._potionEvents = []),
      (this._waterEvents = []),
      this._isWatered &&
        this._activeFountain &&
        this._waterEvents.push({
          appliedAt: Date.now(),
          durationMs: this._activeFountain.getMsWaterTimeLeft(),
          multiplier: this.app.gardening.fountainMultiplier,
        }),
      this.app.fire("garden:seed:planted", {
        plant: this._plant,
        gardenPatch: this,
      }),
      this.app.screenSystem.closeScreen("inventory"),
      console.log("seed planted"));
  }),
  (GardenPatch.prototype.update = function (t) {
    let e = this._plant;
    if (e && e.growTimeLeftS > 0) {
      let t = Date.now() - this._plantedAt;
      if (
        ((t += this._getCumulativeBoostMs()),
        (e.growTimeLeftS = Math.max(0, e.totalGrowTimeS - t / 1e3)),
        e.growTimeLeftS <= 0)
      )
        return (
          console.log("Plant has finished growing:", e),
          this.markerScript.setBlocked(!1),
          this.markerScript.updateText(
            this.app.i18n.getText("Harvest", this.app.i18n.locale)
          ),
          (e.percentageLabel.enabled = !1),
          e.script.growable.finish(),
          void (window.forceInstancerUpdate = !0)
        );
      const a = 1 - e.growTimeLeftS / e.totalGrowTimeS;
      e.script.growable.showProgress(a),
        (e.percentageLabel.element.text = Math.floor(100 * a) + "%"),
        (this._plant = e);
    }
  }),
  (GardenPatch.prototype._getCumulativeBoostMs = function () {
    let t = 0;
    const e = Date.now();
    for (const a in this._potionEvents) {
      const i = this._potionEvents[a];
      t += (e - i.appliedAt) * (i.multiplier - 1);
    }
    for (const a in this._waterEvents) {
      const i = this._waterEvents[a];
      i.appliedAt + i.durationMs <= e
        ? (t += i.durationMs * (i.multiplier - 1))
        : (t += (e - i.appliedAt) * (i.multiplier - 1));
    }
    return t;
  }),
  (GardenPatch.prototype.getPlant = function () {
    return this._plant;
  }),
  (GardenPatch.prototype.water = function (t) {
    (this._isWatered = !0),
      (this._activeFountain = t),
      (this.wetRender.enabled = !0),
      (this.entity.render.enabled = !1),
      (window.forceInstancerUpdate = !0),
      this._plant &&
        (this._waterEvents.push({
          appliedAt: Date.now(),
          durationMs: 60 * this.app.gardening.fountainMins * 1e3,
          multiplier: this.app.gardening.fountainMultiplier,
        }),
        this.app.fire("garden:plant:watered", {
          plant: this._plant,
          gardenPatch: this,
        }));
  }),
  (GardenPatch.prototype.dryOut = function () {
    (this._isWatered = !1),
      (this._activeFountain = null),
      (this.wetRender.enabled = !1),
      (this.entity.render.enabled = !0),
      (window.forceInstancerUpdate = !0);
  }),
  (GardenPatch.prototype.usePotion = function (t) {
    const e = this.app.gardenDb.getItem(t);
    e &&
      ((this._potionId = t),
      this._potionEvents.push({
        appliedAt: Date.now(),
        multiplier: e.growthSpeedBoost,
      })),
      (this.potionEffect.enabled = !0),
      (this.app.tracking.numPotionsUsed += 1),
      this.app.fire(
        "watcher:track",
        "num_potions_used_" + this.app.tracking.numPotionsUsed
      ),
      this.app.fire("garden:plant:usedPotion", {
        plant: this._plant,
        gardenPatch: this,
      });
  }),
  (GardenPatch.prototype.hideUI = function () {
    this._plant && (this._plant.percentageLabel.enabled = !1);
  }),
  (GardenPatch.prototype.showUI = function () {
    this._plant &&
      this._plant.growTimeLeftS > 0 &&
      (this._plant.percentageLabel.enabled = !0);
  });
var GardenDb = pc.createScript("gardenDb");
GardenDb.attributes.add("restockIntervalMin", {
  type: "number",
  default: 5,
  description:
    "All shops are on the same restock timer, this is the interval in minutes",
}),
  GardenDb.attributes.add("vipDiscount", {
    type: "number",
    default: 0.8,
    description: "VIP discount multiplier, 0.8 means 20% off",
  }),
  (GardenDb.prototype.initialize = function () {
    (this.app.gardenDb = this),
      this._loadContents(),
      this._restockSeeds(),
      this._restockPotions(),
      (this._nextTargetRestockTime = 0),
      this._calculateNextRestockTimeTarget();
  }),
  (GardenDb.prototype._loadContents = function () {
    (this.seeds = []),
      (this.plants = []),
      (this.potions = []),
      this.entity.children.forEach((t) => {
        t.children.forEach((t) => {
          t.script &&
            (t.script.seed
              ? this.seeds.push(t.script.seed)
              : t.script.plant
              ? this.plants.push(t.script.plant)
              : t.script.potion
              ? this.potions.push(t.script.potion)
              : console.error(
                  "Garden item is missing the correct script: " + t.name
                ));
        });
      }),
      console.log("loaded content", {
        seeds: this.seeds,
        plants: this.plants,
        potions: this.potions,
      });
  }),
  (GardenDb.prototype.getItem = function (t) {
    if (t.startsWith("seed_")) {
      const e = this.seeds.find((e) => e.id === t);
      if (e) return e;
    } else if (t.startsWith("plant_")) {
      const e = this.plants.find((e) => e.id === t);
      if (e) return e;
    } else if (t.startsWith("potion_")) {
      const e = this.potions.find((e) => e.id === t);
      if (e) return e;
    }
    return console.warn("Item not found: " + t), null;
  }),
  (GardenDb.prototype.forceSeedRestock = function () {
    this._restockSeeds();
  }),
  (GardenDb.prototype.forcePotionRestock = function () {
    this._restockPotions();
  }),
  (GardenDb.prototype._calculateNextRestockTimeTarget = function () {
    const t = Date.now(),
      e = Math.floor(t / 6e4) % this.restockIntervalMin,
      o = this.restockIntervalMin - e;
    (this._nextTargetRestockTime = t + 60 * o * 1e3),
      (this._nextTargetRestockTime =
        6e4 * Math.floor(this._nextTargetRestockTime / 6e4));
  }),
  (GardenDb.prototype.getTimeMsUntilRestock = function () {
    return Math.max(0, this._nextTargetRestockTime - Date.now());
  }),
  (GardenDb.prototype._updateCountdownTimer = function () {
    Date.now() >= this._nextTargetRestockTime &&
      (this._restockSeeds(),
      this._restockPotions(),
      this._calculateNextRestockTimeTarget(),
      console.log("Shops restocked at", new Date().toLocaleTimeString()));
  }),
  (GardenDb.prototype._restockSeeds = function () {
    this.app.gardenDb.seeds.forEach((t) => {
      "seed_petal_poppy" == t.id
        ? (t.numInStock = Math.floor(5 * Math.random()) + 2)
        : Math.random() < 0.2
        ? (t.numInStock = 0)
        : (t.numInStock = Math.floor(10 * Math.random()) + 1);
    }),
      this.app.fire("garden:seeds:restocked");
  }),
  (GardenDb.prototype._restockPotions = function () {
    this.app.gardenDb.potions.forEach((t) => {
      Math.random() < 0.33
        ? (t.numInStock = 0)
        : (t.numInStock = Math.floor(10 * Math.random()) + 1);
    }),
      this.app.fire("garden:potions:restocked");
  }),
  (GardenDb.prototype.update = function () {
    FrameTracker.num % 20 == 0 && this._updateCountdownTimer();
  });
var PlayerEffects = pc.createScript("playerEffects");
PlayerEffects.attributes.add("effectsPlane", {
  type: "entity",
  description: "The entity with the image element with sprite animations",
}),
  PlayerEffects.attributes.add("metarig", {
    type: "entity",
    description: "The root metarig bone containing all the player bones",
  }),
  PlayerEffects.attributes.add("scaleTransitionTimeS", {
    type: "number",
    default: 0.33,
    description: "The time it takes to transition the scale of the bones",
  }),
  PlayerEffects.attributes.add("scaleTransitionCurve", {
    type: "curve",
    default: {
      keys: [0, 0.9, 0.25, 1.08, 0.5, 0.95, 1, 1],
      type: pc.CURVE_SPLINE,
    },
  }),
  (PlayerEffects.prototype.initialize = function () {
    (this.speedModifier = 1),
      (this._scaledBones = []),
      (this._scaleTransitionCountdownS = 0);
  }),
  (PlayerEffects.prototype.clear = function () {
    (this.speedModifier = 1), (this.effectsPlane.enabled = !1);
    for (let e in this._scaledBones)
      this._scaledBones[e].bone.setLocalScale(1, 1, 1);
    this._scaledBones = [];
  }),
  (PlayerEffects.prototype.applyEffect = function (e) {
    this.app.afterGroupLoaded("playerEffects", () => {
      e.entity.tags.has("plant") ? this._wearPlant(e) : this.clear();
    });
  }),
  (PlayerEffects.prototype._wearPlant = function (e) {
    this.app.afterGroupLoaded("garden", () => {
      const t = this.app.gardenDb.getItem(e.linkedGardenItemId);
      if (t.entity.script.plant)
        switch ((this.clear(), t.playerEffect)) {
          case 1:
            let a = this.effectsPlane;
            (a.enabled = !0),
              (a.element.spriteAsset = t.effectSprite),
              (a.element.color = e.staticColor);
            break;
          case 2:
            this.speedModifier = t.animSpeed;
            break;
          case 3:
            for (let e in t.boneScale) {
              let a = this.metarig.findByName(t.boneScale[e].boneName);
              a &&
                this._scaledBones.push({
                  bone: a,
                  scale: t.boneScale[e].scale,
                });
            }
            this._scaleTransitionCountdownS = this.scaleTransitionTimeS;
        }
      else
        console.warn(
          "We just tried to apply an effect of an invalid garden item: " +
            e.entity.name
        );
    });
  }),
  (PlayerEffects.prototype.postUpdate = function (e) {
    let t = this._scaleTransitionCountdownS,
      a = 1;
    if (t > 0) {
      (t -= e), t <= 0 && (t = 0);
      const s = 1 - t / this.scaleTransitionTimeS;
      (a = this.scaleTransitionCurve.value(s)),
        (this._scaleTransitionCountdownS = t);
    }
    for (let e in this._scaledBones) {
      const t = this._scaledBones[e].scale;
      this._scaledBones[e].bone.setLocalScale(t.x * a, t.y * a, t.z * a);
    }
  });
var EnvironmentColorSystem = pc.createScript("environmentColorSystem");
EnvironmentColorSystem.attributes.add("items", { type: "entity", array: !0 }),
  (EnvironmentColorSystem.prototype.initialize = function () {
    this.app.environmentColorSystem = this;
  });
var AreaSystem = pc.createScript("areaSystem");
AreaSystem.attributes.add("stationGroups", {
  type: "entity",
  array: !0,
  description:
    "We check the children of these entities for station tags and add them to stations array",
}),
  AreaSystem.attributes.add("teleporters", {
    type: "entity",
    array: !0,
    description: "All teleporters must be added to this array for them to work",
  }),
  AreaSystem.attributes.add("waitingAreas", {
    type: "entity",
    array: !0,
    description:
      "All waiting areas must be added to this array for them to work",
  }),
  (AreaSystem.prototype.initialize = function () {
    (this.app.areaSystem = this), (this.stations = []);
    for (let t = 0; t < this.stationGroups.length; t++) {
      this.stationGroups[t].children.forEach(function (t) {
        t.tags.has("station") && this.stations.push(t);
      }, this);
    }
  }),
  (AreaSystem.prototype.getStation = function (t) {
    for (let e in this.stations) {
      const a = this.stations[e];
      if (a.name == t) return a;
    }
    return null;
  });
var Fountain = pc.createScript("fountain");
Fountain.attributes.add("waterEntities", { type: "entity", array: !0 }),
  Fountain.attributes.add("worldButtonMarker", { type: "entity" }),
  Fountain.attributes.add("gardenPatches", { type: "entity", array: !0 }),
  Fountain.attributes.add("startTimeS", {
    type: "number",
    default: 2,
    description: "Animation duration for starting the fountain",
  }),
  Fountain.attributes.add("stopTimeS", {
    type: "number",
    default: 2,
    description: "Animation duration for stopping the fountain",
  }),
  Fountain.attributes.add("startKinetics", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "entity",
        type: "entity",
        description: "The entity to be scaled/translated",
      },
      {
        name: "scaleCurve",
        type: "curve",
        description: "The curve to use for scaling on all three axes",
      },
      {
        name: "yCurve",
        type: "curve",
        description: "The curve describing the local y position",
      },
    ],
  }),
  Fountain.attributes.add("stopKinetics", {
    type: "json",
    array: !0,
    schema: [
      {
        name: "entity",
        type: "entity",
        description: "The entity to be scaled/translated",
      },
      {
        name: "scaleCurve",
        type: "curve",
        description: "The curve to use for scaling on all three axes",
      },
      {
        name: "yCurve",
        type: "curve",
        description: "The curve describing the local y position",
      },
    ],
  }),
  (Fountain.prototype.initialize = function () {
    (this._startedAt = 0),
      (this._action = ""),
      (this._kineticCountdownS = 0),
      (this._autoOffCountdownS = 0),
      this.app.gardening.registerFountain(this.entity.name, this),
      (this.markerScript = this.worldButtonMarker.script.worldButtonMarker),
      this.markerScript.on(
        "marker:show",
        () => {
          this.markerScript.on("button:clicked", this._turnOn, this);
        },
        this
      ),
      this.markerScript.on(
        "marker:hide",
        () => {
          this.markerScript.off("button:clicked", this._turnOn, this);
        },
        this
      );
    for (let t in this.waterEntities) {
      let i = this.waterEntities[t];
      i && window.setVDynamic(i, !0);
    }
  }),
  (Fountain.prototype.getSaveData = function () {
    return { startedAt: this._startedAt };
  }),
  (Fountain.prototype.restore = function (t) {
    t &&
      Date.now() - t.startedAt < 60 * this.app.gardening.fountainMins * 1e3 &&
      ((this._startedAt = t.startedAt),
      this.markerScript.setBlocked(!0),
      this._callPatchMethod("water"),
      (this._action = "starting"),
      (this._kineticCountdownS = 0.1 * this.startTimeS));
  }),
  (Fountain.prototype.getMsWaterTimeLeft = function () {
    return this._startedAt <= 0
      ? 0
      : this._startedAt +
          60 * this.app.gardening.fountainMins * 1e3 -
          Date.now();
  }),
  (Fountain.prototype._turnOn = function () {
    (this._startedAt = Date.now()),
      (this._action = "starting"),
      (this._kineticCountdownS = this.startTimeS),
      this.markerScript.setBlocked(!0),
      this._callPatchMethod("water"),
      this.app.fire("garden:fountain:on", this),
      (this.app.tracking.numFountainsActivated += 1),
      this.app.fire(
        "watcher:track",
        "num_fountains_activated_" + this.app.tracking.numFountainsActivated
      );
  }),
  (Fountain.prototype._turnOff = function () {
    (this._startedAt = 0),
      (this._action = "stopping"),
      (this._kineticCountdownS = this.stopTimeS),
      this.markerScript.setBlocked(!1),
      this._callPatchMethod("dryOut");
  }),
  (Fountain.prototype._callPatchMethod = function (t) {
    setTimeout(() => {
      for (let i in this.gardenPatches) {
        let e = this.gardenPatches[i].script.gardenPatch;
        e && e[t](this);
      }
    }, 1e3 * this.startTimeS);
  }),
  (Fountain.prototype.update = function (t) {
    this._startedAt > 0 && this.getMsWaterTimeLeft() <= 0 && this._turnOff();
    let i = this._kineticCountdownS;
    if (i > 0) {
      i -= t;
      const e =
        "starting" === this._action ? this.startKinetics : this.stopKinetics;
      let n =
        1 -
        i / ("starting" === this._action ? this.startTimeS : this.stopTimeS);
      n > 1 && (n = 1);
      for (let t in e) {
        let i = e[t];
        if (i.entity) {
          let t = i.scaleCurve.value(n);
          i.entity.setLocalScale(t, t, t);
          let e = i.yCurve.value(n),
            a = i.entity.getLocalPosition();
          i.entity.setLocalPosition(a.x, e, a.z);
        }
      }
      this._kineticCountdownS = i;
    }
  });
var GardenUnlock = pc.createScript("gardenUnlock");
GardenUnlock.attributes.add("starCost", { type: "number", default: 100 }),
  GardenUnlock.attributes.add("gardenPatches", { type: "entity", array: !0 }),
  GardenUnlock.attributes.add("worldButtonMarker", { type: "entity" }),
  (GardenUnlock.prototype.initialize = function () {
    (this._unlocked = !1),
      (this.markerScript = this.worldButtonMarker.script.worldButtonMarker),
      this.app.gardening.registerGardenUnlock(this.entity.name, this),
      this.markerScript.on(
        "marker:show",
        () => {
          this.markerScript.on("button:clicked", this._onClicked, this);
        },
        this
      ),
      this.markerScript.on(
        "marker:hide",
        () => {
          this.markerScript.off("button:clicked", this._onClicked, this);
        },
        this
      );
  }),
  (GardenUnlock.prototype._onClicked = function () {
    this.app.screenSystem.openScreen("gardenUnlock", { unlockSign: this });
  }),
  (GardenUnlock.prototype.restore = function (t) {
    (this._unlocked = t.unlocked),
      t.unlocked &&
        (this.markerScript.setBlocked(!0), (this.entity.enabled = !1));
  }),
  (GardenUnlock.prototype.unlock = function () {
    for (let t in this.gardenPatches) {
      let e = this.gardenPatches[t].script.gardenPatch;
      e.unlock(), e.playSparkles();
    }
    this.markerScript.off("button:clicked", this._onClicked, this),
      this.markerScript.setBlocked(!0),
      (this._unlocked = !0),
      window.setVDynamic(this.entity, !0);
    const t = this.entity.script.pulse;
    t.start(),
      setTimeout(() => {
        this.entity.enabled = !1;
      }, 1e3 * t.pulseTime),
      this.app.fire("watcher:track", "garden_unlocked_" + this.starCost),
      this.app.fire("garden:unlocked", this);
  }),
  (GardenUnlock.prototype.getSaveData = function () {
    return { unlocked: this._unlocked };
  });
var GardenUnlockScreen = pc.createScript("gardenUnlockScreen");
GardenUnlockScreen.attributes.add("buyButton", { type: "entity" }),
  GardenUnlockScreen.attributes.add("price", { type: "entity" }),
  GardenUnlockScreen.attributes.add("buyText", { type: "entity" }),
  GardenUnlockScreen.attributes.add("starIcon", { type: "entity" }),
  (GardenUnlockScreen.prototype.initialize = function () {
    (this._activeSign = null),
      this.entity.on("screen:onOpen", this._onOpen, this),
      this.buyButton.button.on("click", this._onBuyButtonClick, this);
  }),
  (GardenUnlockScreen.prototype._onOpen = function (t) {
    t.unlockSign && (this._activeSign = t.unlockSign),
      (this.price.element.text = this._activeSign.starCost.toLocaleString()),
      this.app.globals.starCount >= this._activeSign.starCost
        ? (this.buyButton.script.shake.start(),
          (this.buyButton.button.active = !0),
          (this.buyText.element.opacity = 1),
          (this.starIcon.element.opacity = 1),
          (this.price.element.opacity = 1))
        : (this.buyButton.script.shake.stop(),
          this.buyButton.script.pulse.stop(),
          (this.buyButton.button.active = !1),
          (this.buyText.element.opacity = 0.5),
          (this.starIcon.element.opacity = 0.5),
          (this.price.element.opacity = 0.5));
  }),
  (GardenUnlockScreen.prototype._onBuyButtonClick = function () {
    this.buyButton.script.pulse.start(),
      this.app.fire("garden:unlock:attempt", this._activeSign);
  });
var GardeningSystem = pc.createScript("gardeningSystem");
GardeningSystem.attributes.add("seedShopEntryPosition", {
  type: "entity",
  description: "Spawn point for quick-traveling to the seed shop",
}),
  GardeningSystem.attributes.add("potionShopEntryPosition", {
    type: "entity",
    description: "Spawn point for quick-traveling to the potion shop",
  }),
  GardeningSystem.attributes.add("fountainMins", {
    type: "number",
    default: 2,
    description: "How long fountains will run for (in minutes)",
  }),
  GardeningSystem.attributes.add("fountainMultiplier", {
    type: "number",
    default: 1.5,
    description: "How much the fountain boosts plant growth",
  }),
  GardeningSystem.attributes.add("tutorial", { type: "entity" }),
  GardeningSystem.attributes.add("rarities", {
    type: "json",
    array: !0,
    schema: [
      {
        type: "number",
        name: "rarity",
        description: "Must match rarity in plant.js",
        enum: [
          { common: 0 },
          { uncommon: 1 },
          { rare: 2 },
          { epic: 3 },
          { legendary: 4 },
          { mythic: 5 },
          { ascendant: 6 },
          { divine: 7 },
          { celestial: 8 },
          { eternal: 9 },
        ],
      },
      { name: "sprite", type: "asset", assetType: "sprite" },
    ],
  }),
  (GardeningSystem.prototype.initialize = function () {
    (this.app.gardening = this),
      (this.activeGardenPatch = null),
      (this.gardenPatches = {}),
      (this.gardenUnlocks = {}),
      (this.fountains = {}),
      this.app.on("garden:seed:pick", this._onSeedPick, this),
      this.app.on("garden:plant:care", this._onPlantCare, this),
      this.app.on("garden:plant:seed", this._onPlantSeed, this),
      this.app.on("garden:plant:sell", this._onPlantSell, this),
      this.app.on("garden:fountain:on", this._saveFountains, this),
      this.app.on("garden:unlocked", this._onGardenUnlocked, this),
      this.app.on("garden:plant:harvest", this._onPlantHarvest, this),
      this.app.on("garden:seed:planted", this._saveGardenPatches, this),
      this.app.on("garden:plant:watered", this._saveGardenPatches, this),
      this.app.on("garden:plant:harvested", this._saveGardenPatches, this),
      this.app.on("garden:plant:usedPotion", this._saveGardenPatches, this),
      this.app.on("garden:unlock:attempt", this._onGardenUnlockAttempt, this),
      this.app.on(
        "garden:seed:purchase:attempt",
        this._onSeedPurchaseAttempt,
        this
      ),
      this.app.on(
        "garden:potion:purchase:attempt",
        this._onPotionPurchaseAttempt,
        this
      ),
      this.app.on(
        "garden:seed:adUnlock:attempt",
        this._onSeedAdUnlockAttempt,
        this
      ),
      this.app.on(
        "garden:potion:adUnlock:attempt",
        this._onPotionAdUnlockAttempt,
        this
      ),
      this.app.on("garden:adRestock:seeds", this._restockSeedsWithAd, this),
      this.app.on("garden:adRestock:potions", this._restockPotionsWithAd, this),
      this.app.on(
        "garden:teleport:seeds",
        this._teleportToShop.bind(this, "seeds")
      ),
      this.app.on(
        "garden:teleport:potions",
        this._teleportToShop.bind(this, "potions")
      );
  }),
  (GardeningSystem.prototype.registerGardenPatch = function (t, e) {
    this.gardenPatches[t] = e;
  }),
  (GardeningSystem.prototype.registerGardenUnlock = function (t, e) {
    this.gardenUnlocks[t] = e;
  }),
  (GardeningSystem.prototype.registerFountain = function (t, e) {
    this.fountains[t] = e;
  }),
  (GardeningSystem.prototype.setActiveGardenPatch = function (t) {
    this.activeGardenPatch = t;
  }),
  (GardeningSystem.prototype.clearActiveGardenPatch = function () {
    this.activeGardenPatch = null;
  }),
  (GardeningSystem.prototype._onSeedPick = function (t) {
    t &&
      this.app.screenSystem.openScreen("inventory", {
        isolated: !0,
        tabName: "seeds",
        gardenPatch: t,
        showBackground: !1,
        hideLocalPlayer: !0,
        cameraLookAt: t.worldButtonMarker.getPosition(),
        cameraSettings: t.getCameraSettings(),
        activeStationName: "inventory",
      });
  }),
  (GardeningSystem.prototype._onPlantCare = function (t) {
    t &&
      ((this.app.tracking.numPlantCaresOpened += 1),
      this.app.fire(
        "watcher:track",
        "num_plant_cares_opened_" + this.app.tracking.numPlantCaresOpened
      ),
      this.app.screenSystem.openScreen("plantCare", {
        gardenPatch: t,
        showBackground: !1,
        hideLocalPlayer: !0,
        cameraLookAt: t.worldButtonMarker.getPosition(),
        cameraSettings: t.getCameraSettings(),
        activeStationName: "care",
      }));
  }),
  (GardeningSystem.prototype._onPlantSeed = function (t) {
    if (
      null == this.app.gardening.activeGardenPatch ||
      this.app.gardening.activeGardenPatch.hasActivePlant()
    )
      console.log(
        "Cannot plant seed, no active garden patch or already has a plant."
      );
    else if (this.app.globals.localInventory.withdrawSeed(t.id)) {
      let e = this.app.gardening.activeGardenPatch;
      e &&
        (e.plantSeed(t),
        console.log("Planted seed in garden patch:", e.entity.name),
        (this.app.tracking.numSeedsPlanted += 1),
        this.app.fire(
          "watcher:track",
          "num_seeds_planted_" + this.app.tracking.numSeedsPlanted
        ));
    } else console.log("Failed to withdraw seed from inventory:", t.id);
  }),
  (GardeningSystem.prototype._onPlantSell = function (t) {
    const e = this.app.gardenDb.getItem(t);
    e &&
      this.app.globals.localInventory.withdrawPlant(t) &&
      (this.app.fire("stars:earn", e.sellPrice),
      this.app.fire("garden:plant:sold", e),
      (this.app.tracking.numPlantsSold += 1),
      this.app.fire(
        "watcher:track",
        "num_plants_sold_" + this.app.tracking.numPlantsSold
      ));
  }),
  (GardeningSystem.prototype._onPlantHarvest = function (t) {
    t &&
      (console.log("we will add plant to inventory ", t.variant),
      this.app.globals.localInventory.addPlant(t.variant.id),
      this.app.screenSystem.openScreen("plantHarvest", { plant: t }),
      (this.app.tracking.numPlantsHarvested += 1),
      this.app.fire(
        "watcher:track",
        "num_plants_harvested_" + this.app.tracking.numPlantsHarvested
      ));
  }),
  (GardeningSystem.prototype._onSeedPurchaseAttempt = function (t) {
    let e = this.app.gardenDb.getItem(t),
      n = e.buyPrice;
    this.app.vipRoom.hasAccess() && (n = this.app.gardening.getVIPPrice(n)),
      this.app.globals.starCount >= n
        ? (this.app.fire("stars:spend", n),
          (e.numInStock -= 1),
          this.app.globals.localInventory.addSeed(t),
          this.app.fire("garden:seed:stock:update", t),
          this.app.fire("longChimes"),
          (this.app.tracking.numSeedsPurchased += 1),
          this.app.fire(
            "watcher:track",
            "num_seeds_purchased_" + this.app.tracking.numSeedsPurchased
          ))
        : this.app.currency.showErrorState();
  }),
  (GardeningSystem.prototype._onPotionPurchaseAttempt = function (t) {
    let e = this.app.gardenDb.getItem(t),
      n = e.buyPrice;
    this.app.vipRoom.hasAccess() && (n = this.app.gardening.getVIPPrice(n)),
      this.app.globals.starCount >= n
        ? (this.app.fire("stars:spend", n),
          (e.numInStock -= 1),
          this.app.globals.localInventory.addPotion(t),
          this.app.fire("garden:potion:stock:update", t),
          this.app.fire("longChimes"),
          (this.app.tracking.numPotionsPurchased += 1),
          this.app.fire(
            "watcher:track",
            "num_potions_purchased_" + this.app.tracking.numPotionsPurchased
          ))
        : this.app.currency.showErrorState();
  }),
  (GardeningSystem.prototype._restockSeedsWithAd = function () {
    this.app.fire(
      "poki:rewardedBreak:play",
      function () {
        this.app.gardenDb.forceSeedRestock();
      }.bind(this),
      function () {}.bind(this)
    );
  }),
  (GardeningSystem.prototype._restockPotionsWithAd = function () {
    this.app.fire(
      "poki:rewardedBreak:play",
      function () {
        this.app.gardenDb.forcePotionRestock();
      }.bind(this),
      function () {}.bind(this)
    );
  }),
  (GardeningSystem.prototype._onSeedAdUnlockAttempt = function (t) {
    let e = this.app.gardenDb.getItem(t);
    e &&
      e.numInStock > 0 &&
      this.app.fire(
        "poki:rewardedBreak:play",
        function () {
          (e.numInStock -= 1),
            this.app.globals.localInventory.addSeed(t),
            this.app.fire("garden:seed:stock:update", t),
            this.app.fire("longChimes");
        }.bind(this),
        function () {}.bind(this)
      );
  }),
  (GardeningSystem.prototype._onPotionAdUnlockAttempt = function (t) {
    let e = this.app.gardenDb.getItem(t);
    e &&
      e.numInStock > 0 &&
      this.app.fire(
        "poki:rewardedBreak:play",
        function () {
          (e.numInStock -= 1),
            this.app.globals.localInventory.addPotion(t),
            this.app.fire("garden:potion:stock:update", t),
            this.app.fire("longChimes");
        }.bind(this),
        function () {}.bind(this)
      );
  }),
  (GardeningSystem.prototype._teleportToShop = function (t) {
    "seeds" === t
      ? this.app.globals.localPlayer.setPosition(
          this.seedShopEntryPosition.getPosition()
        )
      : "potions" === t &&
        this.app.globals.localPlayer.setPosition(
          this.potionShopEntryPosition.getPosition()
        ),
      (window.forceInstancerUpdate = !0),
      this.app.camera.snap(),
      this.app.fire("teleportSound"),
      this.app.fire("watcher:track", "player_ui_teleported_" + t);
  }),
  (GardeningSystem.prototype.getVIPPrice = function (t) {
    return Math.floor(t * this.app.gardenDb.vipDiscount);
  }),
  (GardeningSystem.prototype._onGardenUnlockAttempt = function (t) {
    if (t) {
      const e = t.starCost;
      this.app.globals.starCount >= e &&
        (this.app.fire("stars:spend", e),
        t.unlock(),
        this.app.fire("garden:unlock:success", t),
        this.app.screenSystem.closeScreen("gardenUnlock"),
        this.app.fire("longChimes"));
    }
  }),
  (GardeningSystem.prototype._saveFountains = function () {
    let t = {};
    for (let e in this.fountains) t[e] = this.fountains[e].getSaveData();
    this.app.saveStats("fountains", t);
  }),
  (GardeningSystem.prototype._onGardenUnlocked = function () {
    this._saveGardenUnlocks(), this._saveGardenPatches();
  }),
  (GardeningSystem.prototype._saveGardenUnlocks = function () {
    let t = {};
    for (let e in this.gardenUnlocks)
      t[e] = this.gardenUnlocks[e].getSaveData();
    this.app.saveStats("gardenUnlocks", t);
  }),
  (GardeningSystem.prototype._saveGardenPatches = function () {
    let t = {};
    for (let e in this.gardenPatches) {
      let n = this.gardenPatches[e];
      n && n.entity && n.entity.script && (t[e] = n.getSaveData());
    }
    this.app.saveStats("gardenPatches", t);
  }),
  (GardeningSystem.prototype.loadGardenUnlocks = function (t) {
    for (let e in t)
      this.gardenUnlocks[e] && this.gardenUnlocks[e].restore(t[e]);
  }),
  (GardeningSystem.prototype.loadGardenPatches = function (t) {
    for (let e in t)
      this.gardenPatches[e] && this.gardenPatches[e].restore(t[e]);
  }),
  (GardeningSystem.prototype.loadFountains = function (t) {
    for (let e in t) this.fountains[e] && this.fountains[e].restore(t[e]);
  }),
  (GardeningSystem.prototype.loadTutorial = function (t) {
    this.tutorial.script.gardeningTutorial.load(t);
  });
var GardeningTutorial = pc.createScript("gardeningTutorial");
GardeningTutorial.attributes.add("arrow", { type: "entity" }),
  GardeningTutorial.attributes.add("seedShop", { type: "entity" }),
  GardeningTutorial.attributes.add("gardenPatch", { type: "entity" }),
  GardeningTutorial.attributes.add("arrowHideAtDistance", {
    type: "number",
    default: 6,
  }),
  (GardeningTutorial.prototype.initialize = function () {
    (this._bbx = new pc.BoundingBox(
      this.entity.getPosition(),
      this.entity.collision.halfExtents
    )),
      (this._progress = { seedPurchased: !1, seedPlanted: !1 }),
      window.setVDynamic(this.arrow, !0),
      this.app.once("garden:seed:planted", this._onSeedPlanted, this),
      this.app.once("garden:seed:stock:update", this._onSeedPurchased, this);
  }),
  (GardeningTutorial.prototype._onSeedPlanted = function () {
    (this._progress.seedPlanted = !0),
      this.app.saveStats("gardenTutorial", this._progress),
      this._endTutorial();
  }),
  (GardeningTutorial.prototype._onSeedPurchased = function () {
    (this._progress.seedPurchased = !0),
      this.app.saveStats("gardenTutorial", this._progress);
  }),
  (GardeningTutorial.prototype.load = function (t) {
    (this._progress = t),
      console.log("loading tutorial", this._progress),
      this._progress.seedPurchased &&
        this._progress.seedPlanted &&
        this._endTutorial();
  }),
  (GardeningTutorial.prototype._endTutorial = function () {
    (this.arrow.enabled = !1),
      this.app.off("garden:seed:planted", this._onSeedPlanted),
      this.app.off("garden:seed:stock:update", this._onSeedPurchased),
      (this.entity.enabled = !1),
      console.log("Tutorial ended");
  }),
  (GardeningTutorial.prototype.update = function (t) {
    const e = this.app.globals.localPlayer.getPosition();
    this.app.screenSystem.hasActiveScreen() || !1 === this._bbx.containsPoint(e)
      ? (this.arrow.enabled = !1)
      : !1 === this._progress.seedPurchased
      ? this._pointArrowAt(this.seedShop.getPosition())
      : !1 === this._progress.seedPlanted &&
        this._pointArrowAt(this.gardenPatch.getPosition());
  }),
  (GardeningTutorial.prototype._pointArrowAt = function (t) {
    const e = this.app.globals.localPlayer.getPosition();
    if (
      Math.pow(t.x - e.x, 2) + Math.pow(t.z - e.z, 2) <=
      this.arrowHideAtDistance
    )
      this.arrow.enabled = !1;
    else {
      const i = this.arrow.enabled;
      (this.arrow.enabled = !0),
        !1 === i &&
          (this.arrow.script.pulse.start(), (window.forceInstancerUpdate = !0));
      const s = Math.atan2(t.z - e.z, t.x - e.x);
      this.arrow.setEulerAngles(0, -s * (180 / Math.PI), 0),
        this.arrow.setPosition(
          e.x + 0.8 * Math.cos(s),
          e.y + 0.8,
          e.z + 0.8 * Math.sin(s)
        );
    }
  });
var CollectibleSystem = pc.createScript("collectibleSystem");
CollectibleSystem.attributes.add("uiCountElement", {
  type: "entity",
  description: "The UI element showing num collected.",
}),
  CollectibleSystem.attributes.add("uiStationCurrency", {
    type: "entity",
    description: "The UI element showing collectible currency in station.",
  }),
  (CollectibleSystem.prototype.initialize = function () {
    (this.items = {}),
      (this.app.collectibles = this),
      this.app.on("collectibles:loaded", () => {
        const e = this.app.globals.collectedCollectibles;
        for (const t of Object.keys(e)) {
          const i = this.items[t];
          if (i)
            for (const l of e[t]) {
              const e = i.find((e) => e.entity.name === l);
              e && this._erase(e);
            }
        }
      }),
      this.app.on("station:enter", (e) => {
        this.uiCountElement.enabled = !1;
        const t = this.app.stationSystem.getStationByName(e);
        if (t && t.eventCurrency) {
          this.uiStationCurrency.enabled = !0;
          const e = this.app.globals.collectibleCurrency[t.eventCurrency] || 0;
          this.uiStationCurrency.element.text = e;
        } else this.uiStationCurrency.enabled = !1;
      }),
      this.app.on("ui:inventory:open", () => {
        this.uiCountElement.enabled = !1;
      });
  }),
  (CollectibleSystem.prototype.registerItem = function (e) {
    let t = this.items[e.eventPrefix];
    if (t && -1 !== t.indexOf(e))
      return void console.error(
        `Collectible item with name ${e.entity.name} already registered.`
      );
    const i = this.app.globals.collectedCollectibles[e.eventPrefix];
    i && i[e.entity.name]
      ? this._erase(e)
      : (t || (this.items[e.eventPrefix] = []),
        this.items[e.eventPrefix].push(e));
  }),
  (CollectibleSystem.prototype.attemptToSpendCollectibles = function (e, t) {
    const i = this.app.globals.collectibleCurrency;
    return i[e] && i[e] >= t
      ? ((i[e] -= t),
        (this.app.globals.collectibleCurrency = i),
        this.app.saveStats("collectibleCurrency", i),
        this._updateStationCurrencyUI(e),
        !0)
      : (console.warn(
          "Not enough collectible currency to complete purchase of: " + t
        ),
        this.uiStationCurrency.script.bounce.start(),
        !1);
  }),
  (CollectibleSystem.prototype._erase = function (e) {
    const t = this.items[e.eventPrefix].indexOf(e);
    -1 !== t &&
      (this.items[e.eventPrefix].splice(t, 1),
      e.entity.parent.removeChild(e.entity),
      e.entity.destroy());
  }),
  (CollectibleSystem.prototype.checkCollisions = function (e) {
    const t = e.getPosition();
    for (const i in this.items)
      for (const l in this.items[i]) {
        const n = this.items[i][l];
        !1 === n.isDisabled() && n.containsPoint(t) && this.collectItem(e, n);
      }
  }),
  (CollectibleSystem.prototype.collectItem = function (e, t) {
    this._saveToStats(t),
      this._addCurrency(t),
      this._lerpOut(t),
      this._updateHUDCountUI(t),
      this._updateStationCurrencyUI(t.eventPrefix),
      this.app.fire("upwardTone");
  }),
  (CollectibleSystem.prototype._saveToStats = function (e) {
    let t = this.app.globals.collectedCollectibles,
      i = t[e.eventPrefix];
    i && i.includes(e.entity.name)
      ? console.error(
          `Collectible in group ${
            e.eventPrefix + ", " + e.entity.name
          } already collected.`
        )
      : (i || ((t[e.eventPrefix] = []), (i = t[e.eventPrefix])),
        i.push(e.entity.name),
        this.app.saveStats("collectedCollectibles", t),
        (this.app.globals.collectedCollectibles = t));
  }),
  (CollectibleSystem.prototype._addCurrency = function (e) {
    if (e.currencyAward > 0) {
      let t = this.app.globals.collectibleCurrency;
      t[e.eventPrefix] || (t[e.eventPrefix] = 0),
        (t[e.eventPrefix] += e.currencyAward),
        (this.app.globals.collectibleCurrency = t),
        this.app.saveStats("collectibleCurrency", t);
    }
  }),
  (CollectibleSystem.prototype._lerpOut = function (e) {
    if ((e.disable(), e.entity.script && e.entity.script.pulse)) {
      let t = e.entity.script.pulse;
      t.start(),
        t.once("pulse:finished", () => {
          this._erase(e);
        });
    } else this._erase(e);
  }),
  (CollectibleSystem.prototype._updateHUDCountUI = function (e) {
    const t = this.app.globals.collectedCollectibles[e.eventPrefix].length;
    let i = 0;
    for (let t in this.items[e.eventPrefix])
      this.items[e.eventPrefix][t].isDisabled() || i++;
    const l = t + i;
    this.app.fire(
      "watcher:track",
      "collectible_pickup_" + e.eventPrefix + "_" + t + "_of_" + l
    );
    let n = this.uiCountElement;
    (n.enabled = !0),
      n.setLocalScale(0, 0, 0),
      (n.element.text = `${t}/${l}`),
      n.script.pulse.start(),
      n.script.pulse.once("pulse:finished", () => {
        n.enabled = !1;
      });
  }),
  (CollectibleSystem.prototype._updateStationCurrencyUI = function (e) {
    const t = this.app.globals.collectibleCurrency[e];
    let i = this.uiStationCurrency;
    (i.enabled = !0), (i.element.text = t);
  });
var Collectible = pc.createScript("collectible");
Collectible.attributes.add("bobTimeS", { type: "number", default: 1.5 }),
  Collectible.attributes.add("bobCurve", {
    type: "curve",
    default: { keys: [0, 0, 0.5, 0.25, 1, 0] },
  }),
  Collectible.attributes.add("eventPrefix", {
    type: "string",
    default: new Date().getFullYear().toString(),
    description:
      'Use the year and event name eg "2025hween", "2024easter". Must match eventCurrency in dbItem (if applicable). Will be grouped in playerStats by [eventPrefix].',
  }),
  Collectible.attributes.add("currencyAward", { type: "number", default: 0 }),
  (Collectible.prototype.initialize = function () {
    (this._boundingBox = new pc.BoundingBox(
      this.entity.getPosition().add(this.entity.collision.linearOffset),
      this.entity.collision.halfExtents
    )),
      (this._bobCountdownS = pc.math.random(0, this.bobTimeS)),
      this.app.collectibles.registerItem(this),
      (this._startY = this.entity.getPosition().y),
      (this._isDisabled = !1);
  }),
  (Collectible.prototype.disable = function () {
    (this._bobCountdownS = 0), (this._isDisabled = !0);
  }),
  (Collectible.prototype.enable = function () {
    this._isDisabled = !1;
  }),
  (Collectible.prototype.isDisabled = function () {
    return this._isDisabled;
  }),
  (Collectible.prototype.containsPoint = function (t) {
    return this._boundingBox.containsPoint(t);
  }),
  (Collectible.prototype.update = function (t) {
    if (this._bobCountdownS > 0) {
      (this._bobCountdownS -= t),
        this._bobCountdownS <= 0 && (this._bobCountdownS = this.bobTimeS);
      const e = 1 - this._bobCountdownS / this.bobTimeS;
      let i = this.entity.getPosition();
      (i.y = this._startY + this.bobCurve.value(e)), this.entity.setPosition(i);
    }
  });
var KinematicBody = pc.createScript("kinematicBody");
KinematicBody.attributes.add("timeMs", {
  type: "number",
  default: 5e3,
  description: "Duration in milliseconds for a full cycle",
}),
  KinematicBody.attributes.add("movement", {
    type: "curve",
    curves: ["x", "y", "z"],
    description: "[x, y, z] movement this entity will follow over timeMs",
  }),
  (KinematicBody.prototype.initialize = function () {
    (this._pos = this.entity.getPosition().clone()),
      (this.entity.prevPos = this._pos.clone()),
      window.setVDynamic(this.entity, !0),
      (this.entity.isKinematic = !0);
  }),
  (KinematicBody.prototype.update = function (t) {
    this.entity.prevPos.copy(this._pos);
    let i = this.app.timers.countdownMs % this.timeMs;
    const e = this.movement.value(i / this.timeMs);
    this._pos.set(e[0], e[1], e[2]), this.entity.setPosition(this._pos);
  });
var Ghost = pc.createScript("ghost");
Ghost.attributes.add("starGroup", { type: "entity" }),
  Ghost.attributes.add("ghostRender", { type: "entity" }),
  (Ghost.prototype.initialize = function () {
    setInterval(
      function () {
        this.moveGhost();
      }.bind(this),
      4e3
    );
  }),
  (Ghost.prototype.moveGhost = function () {
    const t = this.starGroup.script.stars.locations,
      s = t[Math.floor(Math.random() * t.length)];
    this.entity.setPosition(s), this.ghostRender.script.pulse.start();
  });
var PrizeChestSystem = pc.createScript("prizeChestSystem");
(PrizeChestSystem.prototype.initialize = function () {
  (this.chests = {}),
    (this.app.prizeChests = this),
    this.app.on("prizeChests:loaded", () => {
      const e = this.app.globals.prizeChestsOpened;
      for (const t of e) {
        const e = this.chests[t];
        e && this._erase(e);
      }
    });
}),
  (PrizeChestSystem.prototype.registerChest = function (e) {
    this.chests[e.entity.name] = e;
  }),
  (PrizeChestSystem.prototype.checkCollisions = function (e) {
    const t = e.getPosition();
    for (const s in this.chests) {
      const i = this.chests[s];
      !1 === i.isOpened() && i.containsPoint(t) && this.openChest(e, i);
    }
  }),
  (PrizeChestSystem.prototype.openChest = function (e, t) {
    if ((t.open(), t.entity.script && t.entity.script.pulse)) {
      let e = t.entity.script.pulse;
      e.start(),
        e.once("pulse:finished", () => {
          this._erase(t);
        });
    } else this._erase(t);
    this.app.globals.prizeChestsOpened.push(t.entity.name),
      this.app.saveStats(
        "prizeChestsOpened",
        this.app.globals.prizeChestsOpened
      ),
      console.log(t.dbItem.name),
      this.app.globals.unlockedItems.push(t.dbItem.name),
      this.app.saveStats("unlockedItems", this.app.globals.unlockedItems),
      this.app.fire("prize:open", t.dbItem.name),
      this.app.screenSystem.openScreen("prize", {
        prizeDbItem: t.dbItem.script.dbItem,
      });
  }),
  (PrizeChestSystem.prototype._erase = function (e) {
    delete this.chests[e.entity.name],
      e.entity.parent.removeChild(e.entity),
      e.entity.destroy();
  });
var PrizeChest = pc.createScript("prizeChest");
PrizeChest.attributes.add("yRotation", { type: "curve" }),
  PrizeChest.attributes.add("yRotationTimeS", { type: "number", default: 1.5 }),
  PrizeChest.attributes.add("dbItem", {
    type: "entity",
    description: "Db item that will be unlocked when chest is opened.",
  }),
  (PrizeChest.prototype.initialize = function () {
    (this._boundingBox = new pc.BoundingBox(
      this.entity.getPosition().add(this.entity.collision.linearOffset),
      this.entity.collision.halfExtents
    )),
      this.app.prizeChests.registerChest(this),
      (this._animCountdownS = pc.math.random(0, this.yRotationTimeS)),
      window.setVDynamic(this.entity, !0),
      (this._isOpened = !1),
      (null != this.dbItem &&
        this.dbItem.script &&
        this.dbItem.script.dbItem) ||
        console.error("No db item assigned to prize chest " + this.entity.name);
  }),
  (PrizeChest.prototype.open = function () {
    this._isOpened = !0;
  }),
  (PrizeChest.prototype.isOpened = function () {
    return this._isOpened;
  }),
  (PrizeChest.prototype.containsPoint = function (t) {
    return this._boundingBox.containsPoint(t);
  }),
  (PrizeChest.prototype.update = function (t) {
    if (this._animCountdownS > 0) {
      (this._animCountdownS -= t),
        this._animCountdownS < 0 &&
          (this._animCountdownS = this.yRotationTimeS);
      let i = 1 - this._animCountdownS / this.yRotationTimeS,
        e = this.yRotation.value(i);
      this.entity.setLocalEulerAngles(0, e, 0);
    }
  });
var PrizeScreen = pc.createScript("prizeScreen");
PrizeScreen.attributes.add("wearNowButton", { type: "entity" }),
  PrizeScreen.attributes.add("doneButton", { type: "entity" }),
  PrizeScreen.attributes.add("prizeImage", { type: "entity" }),
  (PrizeScreen.prototype.initialize = function () {
    (this._prizeDbItem = null),
      this.entity.on("screen:onOpen", this._onOpen, this),
      this.doneButton.button.on(
        "click",
        () => {
          this.app.screenSystem.closeScreen("prize");
        },
        this
      ),
      this.wearNowButton.button.on("click", this._wearUnlockedItem, this);
  }),
  (PrizeScreen.prototype._onOpen = function (e) {
    e &&
      e.prizeDbItem &&
      ((this._prizeDbItem = e.prizeDbItem),
      (this.prizeImage.element.spriteAsset = this._prizeDbItem.uiSprite),
      this.prizeImage.script.pulse.start(),
      this.app.fire("upwardTone"));
  }),
  (PrizeScreen.prototype._wearUnlockedItem = function () {
    if (null == this._prizeDbItem)
      return (
        console.error("Tried wearing a prize-unlocked item that was null"),
        void this.app.screenSystem.closeScreen("prize")
      );
    this.app.globals.ui
      .findByName(this._prizeDbItem.entity.name)
      .script.fashionItem.setFashionItem(!1),
      this.app.screenSystem.closeScreen("prize"),
      this.app.fire("outfit:transmit");
  });
var BroomDismount = pc.createScript("broomDismount");
BroomDismount.prototype.initialize = function () {
  this.entity.button.on(
    "click",
    function () {
      this.app.globals.ui
        .findByName("handheldNone")
        .script.fashionItem.setFashionItem(!1),
        this.app.fire("outfit:transmit");
    },
    this
  );
};
var Chatbox = pc.createScript("chatbox");
(Chatbox.macOsCss =
  "\n        #scrollwrap::-webkit-scrollbar {\n            -webkit-appearance: none;\n            width: 8px;\n        }\n\n        #scrollwrap::-webkit-scrollbar-track{\n            background-color: #D4DAFF;\n        }\n\n        #scrollwrap::-webkit-scrollbar-thumb {\n            border-radius: 4px;\n            background-color: #B89CF4;\n            -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);\n        }\n    "),
  (Chatbox.prototype.initialize = function () {
    this.isChatOpen = !1;
    const t = navigator.language || navigator.userLanguage,
      e = ["ar", "he", "fa", "ur"].some((e) => t.startsWith(e)),
      o = /Macintosh|Mac OS X/i.test(navigator.userAgent);
    if (o) {
      const t = document.createElement("style");
      (t.textContent = Chatbox.macOsCss), document.head.appendChild(t);
    }
    this.chatbox = document.createElement("div");
    const s = this.chatbox;
    (s.id = "chatbox"),
      (s.style.display = "flex"),
      (s.style.flexDirection = "column"),
      (s.style.position = "absolute"),
      (s.style.fontFamily = "Arial, sans-serif"),
      (s.style.color = "#4C0034"),
      (s.style.background =
        "linear-gradient(118deg, rgba(212, 218, 255, 0.99), rgba(255, 214, 234, 0.92))"),
      (s.dir = e ? "rtl" : "ltr"),
      (s.lang = t),
      (this.scrollWrap = document.createElement("div"));
    const i = this.scrollWrap;
    (i.id = "scrollwrap"),
      (i.style.overflowY = "scroll"),
      (i.style.overflowX = "hidden"),
      (i.style.height = "80%"),
      (i.style.width = "100%"),
      (i.style.display = "flex"),
      (i.style.flexDirection = "column"),
      o || (i.style.scrollbarColor = "#B89CF4 #D4DAFF"),
      (this.inputField = document.createElement("input"));
    const l = this.inputField;
    (l.name = "chat-input"),
      (l.type = "text"),
      (l.autocomplete = "off"),
      (l.style.height = "20%"),
      (l.style.width = "calc(85% - 30px)"),
      (l.style.outline = "none"),
      (l.style.border = "none"),
      (l.style.fontSize = "18px"),
      (l.style.padding = "0px 15px"),
      (l.maxLength = 128),
      (l.style.borderRadius = "0"),
      (this.welcomeMessage = document.createElement("p"));
    const n = this.welcomeMessage;
    (n.style.margin = "10px 15px"),
      (n.style.fontFamily = "Arial, sans-serif"),
      (n.style.fontSize = "20px"),
      (n.style.fontWeight = "800"),
      (n.innerText = this.app.i18n.getText(
        "Welcome to chat!",
        this.app.i18n.locale
      )),
      (this.closeButton = document.createElement("button"));
    const a = this.closeButton;
    (a.style.position = "absolute"),
      (a.style.height = "44px"),
      (a.style.width = "44px"),
      (a.style.top = 0),
      (a.style.right = 0),
      (a.style.backgroundColor = "#CCCAFF"),
      (a.style.border = "none"),
      (a.style.padding = "1px 10px"),
      (this.closeImg = document.createElement("img"));
    const h = this.closeImg;
    (h.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAAPFBMVEUAAABMADRNADVQADhLADNIADBMADRMADNMADRMADRMADRMADRMADRQADBAADBMADRNADVKADJKADBMADSW8/vgAAAAE3RSTlMAf98g3yCA75+PP2+/EBDPYGAwjC3GBwAAAJ1JREFUKM9l0TcCwzAMQ1HIRVSxncL73zXKBInA+v4GYL/Myo64dvmWMXjzsS0G2f8rQHFnENi9wZyBsNfhDMj06gyEveE+piByAnDOgXAMAktQF9ZAmIGwBsoMlDUg6yrZduVMljfJDIQlENZA2eZAOS1nKYc3lSV4LxyDB6+ZJeiYWYOCY2INOjpZAzuBRI6BfTHWUmqQ3Z/SH+AHEBok7IN10W0AAAAASUVORK5CYII="),
      (h.style.maxWidth = "100%"),
      (this.sendButton = document.createElement("button"));
    const c = this.sendButton;
    (c.style.position = "absolute"),
      (c.style.height = "20%"),
      (c.style.width = "15%"),
      (c.style.backgroundColor = "#CCCAFF"),
      (c.style.border = "none"),
      (c.style.bottom = 0),
      (c.style.right = 0),
      (this.sendImg = document.createElement("img"));
    const r = this.sendImg;
    (r.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAdCAYAAADCdc79AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgBzZa7SgNBFIb/nRXr6cQUGhEVrOINglVsI0LwBfQNkjKdWlqJb6BPYAKCZUhnIZgy2LiFiKVgE3CX8Zxc1Ehcj+6JyVcN7Nndb/fM/DMelCkgm44QFWloPaBh4FcruA6k93tQZAfrJQec9L/AC3z4W1IpNSH+MyHC+8EvkUsZKBEhLH53zcFxG2ssjf8SolZl4q/LpNSEuC0/1UikFP+QOxfWxUr5UOIOj8EiUjzMCcotiRWWMVNt4uEZwxDqStWXkLI0zArKB0qp5lCPbayd0Zzak9R+jYQ+oTw2MgbOQgWPAtJlRJWfpNpCBRKJgAuecBgRLPWC1xW/s/e4q1HKdLGTMC1DSzA3BjI9SoZkZjE+WA7GOsYE2n4aPgfaAqbnaFKJVsRwceX3ZZ/H6r6BEWWH6NE0L+kj07+45fASN0dDCcZOjLgatUCaaW0ZHqgLJZFRF0oqoyrUCdjwNokMo3iEjQ6SyqgKOeFGGicDTSEhsTKMplAFCWUYNaEJhKfUtgAJZBi1I2wTT615TFUpne3HNuToaGrKJHOMUZJDxu5i80+niDc6h66L5E3K1AAAAABJRU5ErkJggg=="),
      (r.style.maxWidth = "100%"),
      document.body.appendChild(this.chatbox),
      s.appendChild(this.scrollWrap),
      this.scrollWrap.appendChild(this.welcomeMessage),
      s.appendChild(this.inputField),
      s.appendChild(this.closeButton),
      a.appendChild(this.closeImg),
      s.appendChild(this.sendButton),
      c.appendChild(this.sendImg),
      this.updateStyle(),
      (l.onfocus = this.onFocus.bind(this)),
      (l.onblur = this.onBlur.bind(this)),
      this.app.on("resize", this.updateStyle, this),
      this.app.on("chatbox:open", this.openChatbox, this),
      (a.onclick = this.closeClick.bind(this)),
      (c.onclick = this.sendClick.bind(this)),
      e &&
        ((l.style.textAlign = "right"),
        (l.style.direction = "rtl"),
        (c.style.left = 0),
        (c.style.right = "auto"),
        (r.style.transform = "rotate(180deg)"),
        (a.style.left = 0),
        (a.style.right = "auto")),
      (this._isInitialized = !0);
  }),
  (Chatbox.prototype.updateStyle = function () {
    if ("portrait" === this.app.globals.layout) {
      const t = this.chatbox;
      (t.style.left = 0),
        (t.style.bottom = "0"),
        (t.style.width = "75vw"),
        (t.style.height = "32vh");
    } else {
      const t = this.chatbox;
      (t.style.left = 0),
        (t.style.bottom = "0"),
        (t.style.width = "40vw"),
        (t.style.height = "40vh");
    }
  }),
  (Chatbox.prototype.getValue = function () {
    return this.inputField.value;
  }),
  (Chatbox.prototype.setValue = function (t) {
    this.inputField.value = t;
  }),
  (Chatbox.prototype.closeClick = function () {
    (this.chatbox.style.display = "none"), this.app.fire("chatbox:close");
  }),
  (Chatbox.prototype.sendClick = function () {
    this.app.fire("chatbox:send");
  }),
  (Chatbox.prototype.openChatbox = function () {
    (this.chatbox.style.display = "flex"),
      (this.scrollWrap.scrollTop = this.scrollWrap.scrollHeight),
      (this.welcomeMessage.innerText = this.app.i18n.getText(
        "Welcome to chat!",
        this.app.i18n.locale
      ));
  }),
  (Chatbox.prototype.onFocus = function () {
    this.app.fire("chatbox:focus");
  }),
  (Chatbox.prototype.onBlur = function () {
    this.app.fire("chatbox:blur");
  }),
  (Chatbox.prototype.forceBlur = function () {
    this.inputField && (this.inputField.blur(), this.onBlur());
  }),
  (Chatbox.prototype.moveUp = function () {
    setTimeout(
      function () {
        this.chatbox.style.bottom = "48vh";
      }.bind(this),
      200
    );
  }),
  (Chatbox.prototype.moveDown = function () {
    setTimeout(
      function () {
        this.chatbox.style.bottom = "0";
      }.bind(this),
      200
    );
  }),
  (Chatbox.prototype.isInitialized = function () {
    return !0 === this._isInitialized;
  }),
  (Chatbox.prototype.isClosed = function () {
    return this._isInitialized && "none" == this.chatbox.style.display;
  }),
  (Chatbox.prototype.addMessage = function (t, e) {
    let o = e
      .replace(/\\/g, "\\\\")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]");
    o.endsWith("\\") && (o += "​");
    const s = document.createElement("p");
    (s.innerHTML = `<strong>${t}:</strong> <span style="color: #682E5A;">${o}</span>`),
      (s.style.margin = "4px 15px"),
      this.scrollWrap.appendChild(s),
      (this.scrollWrap.scrollTop = this.scrollWrap.scrollHeight);
  });
