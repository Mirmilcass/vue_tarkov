import gql from "graphql-tag";

const ItemFrag = gql`
  fragment GridFragment on ItemStorageGrid {
    width
    height
    filters {
      allowedCategories {
        id
      }
      allowedItems {
        id
      }
      excludedCategories {
        id
      }
      excludedItems {
        id
      }
    }
  }

  fragment SlotFragment on ItemSlot {
    id
    name
    nameId
    required
    filters {
      allowedCategories {
        id
      }
      allowedItems {
        id
      }
      excludedCategories {
        id
      }
      excludedItems {
        id
      }
    }
  }

  fragment SoftArmorSlotFragment on ItemArmorSlotLocked {
    nameId
    name
    class
    durability
    speedPenalty
    turnPenalty
    ergoPenalty
    material {
      id
      name
    }
    zones
    armorType
  }

  fragment PlateArmorSlotFragment on ItemArmorSlotOpen {
    nameId
    name
    zones
    allowedPlates {
      id
    }
  }

  fragment ArmorSlotFragment on ItemArmorSlot {
    nameId
    zones
    ... on ItemArmorSlotLocked {
      ...SoftArmorSlotFragment
    }
    ... on ItemArmorSlotOpen {
      ...PlateArmorSlotFragment
    }
  }

  fragment ItemPriceFragment on ItemPrice {
    vendor {
      name
      normalizedName
      __typename
      ... on TraderOffer {
        trader {
          id
        }
        minTraderLevel
        taskUnlock {
          id
          tarkovDataId
          name
          normalizedName
        }
      }
    }
    price
    currency
    priceRUB
  }

  fragment StimEffectFragment on StimEffect {
    type
    chance
    delay
    duration
    value
    percent
    skillName
  }

  fragment itemFrag on Item {
    id
    bsgCategoryId
    categories {
      id
      name
      normalizedName
    }
    name
    shortName
    basePrice
    normalizedName
    backgroundColor
    types
    width
    height
    weight
    avg24hPrice
    wikiLink
    changeLast48h
    changeLast48hPercent
    low24hPrice
    high24hPrice
    lastLowPrice
    lastOfferCount
    iconLink
    baseImageLink
    image512pxLink
    image8xLink
    updated
    handbookCategories {
      id
      name
      normalizedName
    }
    sellFor {
      ...ItemPriceFragment
    }
    buyFor {
      ...ItemPriceFragment
    }
    containsItems {
      count
      item {
        id
      }
    }
    properties {
      __typename
      ... on ItemPropertiesAmmo {
        caliber
        damage
        projectileCount
        penetrationPower
        armorDamage
        fragmentationChance
        ammoType
      }
      ... on ItemPropertiesArmor {
        class
        material {
          id
          name
        }
        zones
        durability
        ergoPenalty
        speedPenalty
        turnPenalty
        armorSlots {
          ...ArmorSlotFragment
        }
      }
      ... on ItemPropertiesArmorAttachment {
        class
        material {
          id
          name
        }
        zones
        durability
        ergoPenalty
        speedPenalty
        turnPenalty
      }
      ... on ItemPropertiesBackpack {
        capacity
        grids {
          ...GridFragment
        }
        speedPenalty
        turnPenalty
        ergoPenalty
      }
      ... on ItemPropertiesBarrel {
        ergonomics
        recoilModifier
        slots {
          ...SlotFragment
        }
      }
      ... on ItemPropertiesChestRig {
        capacity
        class
        material {
          id
          name
        }
        zones
        durability
        ergoPenalty
        speedPenalty
        turnPenalty
        grids {
          ...GridFragment
        }
        armorSlots {
          ...ArmorSlotFragment
        }
      }
      ... on ItemPropertiesContainer {
        capacity
        grids {
          ...GridFragment
        }
      }
      ... on ItemPropertiesFoodDrink {
        energy
        hydration
        units
        stimEffects {
          ...StimEffectFragment
        }
      }
      ... on ItemPropertiesGlasses {
        class
        durability
        blindnessProtection
        material {
          id
          name
        }
      }
      ... on ItemPropertiesGrenade {
        type
        fuse
        maxExplosionDistance
        fragments
      }
      ... on ItemPropertiesHeadphone {
        ambientVolume
        distortion
        distanceModifier
      }
      ... on ItemPropertiesHelmet {
        class
        material {
          id
          name
        }
        headZones
        durability
        ergoPenalty
        speedPenalty
        turnPenalty
        deafening
        blocksHeadset
        ricochetY
        slots {
          ...SlotFragment
        }
      }
      ... on ItemPropertiesKey {
        uses
      }
      ... on ItemPropertiesMagazine {
        capacity
        malfunctionChance
        ergonomics
        recoilModifier
        capacity
        loadModifier
        ammoCheckModifier
      }
      ... on ItemPropertiesMedicalItem {
        uses
        useTime
        cures
      }
      ... on ItemPropertiesMedKit {
        hitpoints
        useTime
        maxHealPerUse
        cures
        hpCostLightBleeding
        hpCostHeavyBleeding
      }
      ... on ItemPropertiesPainkiller {
        uses
        useTime
        cures
        painkillerDuration
        energyImpact
        hydrationImpact
      }
      ... on ItemPropertiesPreset {
        baseItem {
          id
          name
          normalizedName
          properties {
            ... on ItemPropertiesWeapon {
              defaultPreset {
                id
              }
            }
          }
        }
        ergonomics
        recoilVertical
        recoilHorizontal
      }
      ... on ItemPropertiesResource {
        units
      }
      ... on ItemPropertiesScope {
        ergonomics
        recoilModifier
        zoomLevels
      }
      ... on ItemPropertiesStim {
        cures
        useTime
        stimEffects {
          ...StimEffectFragment
        }
      }
      ... on ItemPropertiesSurgicalKit {
        uses
        useTime
        cures
        minLimbHealth
        maxLimbHealth
      }
      ... on ItemPropertiesWeapon {
        caliber
        effectiveDistance
        ergonomics
        fireModes
        fireRate
        recoilVertical
        recoilHorizontal
        sightingRange
        recoilAngle
        recoilDispersion
        convergence
        cameraRecoil
        slots {
          ...SlotFragment
        }
        defaultPreset {
          id
          name
          normalizedName
        }
        presets {
          id
          name
          normalizedName
        }
        defaultAmmo {
          id
          name
        }
      }
      ... on ItemPropertiesWeaponMod {
        accuracyModifier
        ergonomics
        recoilModifier
        slots {
          ...SlotFragment
        }
      }
    }
  }
`

export const GetItems = gql`
  query getItems($lang: LanguageCode!, $gameMode: GameMode!, $limit: Int!, $offset: Int!) {
    items(lang: $lang, gameMode: $gameMode, limit: $limit, offset: $offset) {
      ...itemFrag
    }
  }
  ${ItemFrag}
`
export const GetItemsByIds = gql`
  query getItems($lang: LanguageCode!, $gameMode: GameMode!, $ids: [ID]) {
    items(lang: $lang, gameMode: $gameMode, ids: $ids) {
      ...itemFrag
    }
  }
  ${ItemFrag}
`
export const GetItemsByType = gql`
  query getItems($lang: LanguageCode!, $gameMode: GameMode!, $type: ItemType!){
    items(lang: $lang, gameMode: $gameMode, type: $type) {
      ...itemFrag
    }
  }
  ${ItemFrag}
`
export const GetItemById = gql`
  query getItem($lang: LanguageCode!, $gameMode: GameMode!, $id: ID!) {
    item(lang: $lang, gameMode: $gameMode, id: $id) {
      ...itemFrag
    }
  }
  ${ItemFrag}
`
export const GetTraders = gql`
  query getTraders ($lang: LanguageCode!, $gameMode: GameMode!){
    traders(lang: $lang, gameMode: $gameMode) {
      id
      name
      description
      normalizedName
      imageLink
      currency {
        id
        name
        normalizedName
      }
      resetTime
      discount
      levels {
        id
        level
        requiredPlayerLevel
        requiredReputation
        requiredCommerce
        payRate
        insuranceRate
        repairCostMultiplier
      }
    }
  }
`