import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout/MainLayout';
import { Flex, Box } from '@rebass/grid';
import { Input } from 'antd';
import { useFormState } from 'react-use-form-state';
import debounce from 'debounce-promise';
import { searchFromItems } from '../services/trackItem.api';
import moment from 'moment';
import { TrackItemType } from '../enum/TrackItemType';
import { SearchResults } from '../components/SearchResults/SearchResults';
import { SearchOptions } from '../components/SearchResults/SearchOptions';

export function SearchPage({ location }: any) {
    const [_, { text }] = useFormState({});

    const [dataItems, setDataItems] = useState([]);
    const [timerange, setTimerange] = useState([
        moment()
            .startOf('day')
            .subtract(10, 'days'),
        moment().endOf('day'),
    ]);

    const from = moment()
        .startOf('day')
        .subtract(1, 'days');
    const to = moment().endOf('day');
    const taskName = TrackItemType.AppTrackItem;

    const paging = { limit: 10, offset: 0 };
    const loadItems = async searchStr => {
        if (!searchStr.length) {
            setDataItems([]);
            return;
        }

        const items = await searchFromItems({
            from,
            to,
            taskName,
            searchStr,
            paging,
        });
        console.error('Search results:', items);
        setDataItems(items.rows);
        return;
    };
    const debouncedLoadOptions = debounce(loadItems, 1000);

    return (
        <MainLayout location={location}>
            <Flex p={1} w={1} flexDirection="column">
                <Flex p={1}>
                    <Input
                        placeholder="Search from all items"
                        {...text({
                            name: 'search',
                            onChange: e => {
                                debouncedLoadOptions(e.target.value);
                            },
                        })}
                    />
                </Flex>
                <Box p={1}>
                    <SearchOptions setTimerange={setTimerange} timerange={timerange} />
                </Box>
                <Box p={1}>
                    <SearchResults dataItems={dataItems} />
                </Box>
            </Flex>
        </MainLayout>
    );
}
