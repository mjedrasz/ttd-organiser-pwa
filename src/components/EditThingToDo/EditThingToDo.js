import React, { useEffect } from 'react';
import { utcToZonedTime, toDate } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import ThingToDoInputForm from '../ThingToDoInputForm/ThingToDoInputForm';

import { useQuery } from '@apollo/react-hooks';
import ThingToDoByIdQuery from '../../graphQL/ThingToDoByIdQuery';

export default ({ form, disabled }) => {

    const { data } = useQuery(ThingToDoByIdQuery, {
        variables: {
            id: form.values.id
        }, fetchPolicy: "cache-and-network"
    });

    useEffect(() => {
        if (data && data.thingToDoById) {
            const thingToDo = data.thingToDoById;
            const values = {
                id: thingToDo.id,
                name: thingToDo.name,
                description: thingToDo.description,
                thingToDoType: thingToDo.type,
                category: thingToDo.category,
                bookingMandatory: thingToDo.bookingMandatory,
                adultMandatory: thingToDo.adultMandatory,
                age: [thingToDo.target.age.from, thingToDo.target.age.to],
                target: thingToDo.target.type,
                price: [thingToDo.price.from, thingToDo.price.to],
                email: thingToDo.contact.email,
                phone: thingToDo.contact.phone,
                www: thingToDo.contact.www,
                address: thingToDo.where.address,
                coordinates: {
                    lat: thingToDo.where.location.lat,
                    lon: thingToDo.where.location.lon
                },
                image: thingToDo.image && {
                    name: thingToDo.image.name
                },
                fromDate: parseISO(thingToDo.when.dateTime.from),
                toDate: parseISO(thingToDo.when.dateTime.to),
                schedule: thingToDo.when.occurrences.map(o => ({
                    days: [o.dayOfWeek],
                    fromTime: utcToZonedTime(toDate(`1971-01-01T${o.hours.from}`)),
                    toTime: utcToZonedTime(toDate(`1971-01-01T${o.hours.to}`))
                }))
            };
            form.setValues(values);
        }
    }, [data])

    return <ThingToDoInputForm form={form} disabled={disabled} />;
};