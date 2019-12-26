import { I18n } from "aws-amplify";

const ADULT = "ADULT";
const FAMILY = "FAMILY";
const CHILD = "CHILD";

const labels = {
    [ADULT]: I18n.get("Adult"),
    [FAMILY]: I18n.get("Family"),
    [CHILD]: I18n.get("Child")
};

const keys = [
    ADULT,
    FAMILY,
    CHILD
];
    
export {
    keys,
    labels,
    ADULT,
    FAMILY,
    CHILD
};