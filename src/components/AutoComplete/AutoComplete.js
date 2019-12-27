import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import I18n from "@aws-amplify/core/lib/I18n";
import throttle from 'lodash/throttle';
import useStyles from './styles';
import withMap from '../../hoc/withMap';
import GoogleMapsService from '../../services/GoogleMaps';

const GoogleMaps = ({ addressInput, onAddressChange, disabled }) => {

    const classes = useStyles();
    const [inputValue, setInputValue] = React.useState(addressInput.value);
    const [options, setOptions] = React.useState([]);

    const handleChange = event => {
        setInputValue(event.target.value);
    };

    const gmapService = new GoogleMapsService();

    const fetch = React.useMemo(
        () =>
            throttle((input, callback) =>
                gmapService.getPlacePredictions(input, callback)
                , 200),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        fetch({ input: inputValue }, results => {
            if (active) {
                setOptions(results || []);
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, fetch]);

    const handleAddressChange = async (_, value) => {
        if (value) {
            const coordinates = await gmapService.geocode(value.description);
            onAddressChange({ address: value.description, coordinates });
        } else {
            onAddressChange('');
        }
    };

    return (
        <Autocomplete
            getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
            filterOptions={x => x}
            options={options}
            autoComplete
            disabled={disabled}
            includeInputInList
            onChange={handleAddressChange}
            disableOpenOnFocus
            value={addressInput.value}
            renderInput={params => (
                <TextField
                    label={I18n.get("Address")}
                    variant="outlined"
                    fullWidth
                    {...addressInput}
                    {...params}
                    value={inputValue}
                    onChange={handleChange}
                />
            )}
            renderOption={option => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map(match => [match.offset, match.offset + match.length]),
                );

                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                            ))}

                            <Typography variant="body2" color="textSecondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
};

export default withMap(GoogleMaps);