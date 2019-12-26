import { I18n } from "aws-amplify";

const MON = "MON";
const TUE = "TUE";
const WED = "WED";
const THU = "THU";
const FRI = "FRI";
const SAT = "SAT";
const SUN = "SUN";

const labels = {
    [MON]: I18n.get("Mon"),
    [TUE]: I18n.get("Tue"),
    [WED]: I18n.get("Wed"),
    [THU]: I18n.get("Thu"),
    [FRI]: I18n.get("Fri"),
    [SAT]: I18n.get("Sat"),
    [SUN]: I18n.get("Sun")
};

const keys = [
    MON,
    TUE,
    WED,
    THU,
    FRI,
    SAT,
    SUN
];
    
export {
    keys,
    labels,
    MON,
    TUE,
    WED,
    THU,
    FRI,
    SAT,
    SUN
};