import { I18n } from "aws-amplify";

const MUSIC = "MUSIC";
const DANCE = "DANCE";
const ARTS = "ARTS";
const CRAFTS = "CRAFTS";
const SPORT = "SPORT";
const CULTURE = "CULTURE";
const OUTDOOR = "OUTDOOR";
const CINEMA = "CINEMA";
const THEATER = "THEATER";
const PERSONAL_DEVELOPMENT = "PERSONAL_DEVELOPMENT";
const PARTY = "PARTY";
const OTHER = "OTHER";

const labels = {
    [MUSIC]: I18n.get("Music"),
    [DANCE]: I18n.get("Dance"),
    [ARTS]: I18n.get("Arts"),
    [CRAFTS]: I18n.get("Crafts"),
    [SPORT]: I18n.get("Sport"),
    [OUTDOOR]: I18n.get("Outdoor"),
    [CULTURE]: I18n.get("Culture"),
    [CINEMA]: I18n.get("Cinema"),
    [THEATER]: I18n.get("Theater"),
    [PERSONAL_DEVELOPMENT]: I18n.get("Personal development"),
    [PARTY]: I18n.get("Party"),
    [OTHER]: I18n.get("Other")
};
const keys = [
    MUSIC,
    DANCE,
    ARTS,
    CRAFTS,
    SPORT,
    OUTDOOR,
    CULTURE,
    CINEMA,
    THEATER,
    PERSONAL_DEVELOPMENT,
    PARTY,
    OTHER];
    
export {
    keys,
    labels,
    MUSIC,
    DANCE,
    ARTS,
    CRAFTS,
    SPORT,
    OUTDOOR,
    CULTURE,
    CINEMA,
    THEATER,
    PERSONAL_DEVELOPMENT,
    PARTY,
    OTHER
};