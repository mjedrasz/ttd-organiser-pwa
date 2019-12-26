import { I18n } from "aws-amplify";

const EVENT = "EVENT";
const RECURRING_EVENT = "RECURRING_EVENT";
const PLACE = "PLACE";

const labels = {
    [EVENT]: I18n.get("Event"),
    [RECURRING_EVENT]: I18n.get("Recurring event"),
    [PLACE]: I18n.get("Place")
};

const keys = [
    EVENT,
    RECURRING_EVENT,
    PLACE
];
    
export {
    keys,
    labels,
    EVENT,
    RECURRING_EVENT,
    PLACE
};