import { useState, useEffect, useCallback } from 'react';
import algoliasearch from 'algoliasearch';
// import envVars from '../common/env';

const ALGOLIA_APP_ID = '8K6J5OJIQW';
// const { ALGOLIA_API_KEY } = envVars;

export type Hit = {
	objectID: number,
	title: string
};

type SearchState = {
	query: string,
	hits: Hit[]
};

type UseAlgoliaProps = {
	indexName: string
};

export function useAlgolia({ indexName }: UseAlgoliaProps) {
	const [searchState, setSearchState] = useState<SearchState>({
		query: 'product_help_dev',
		hits: []
	});

	const algoliaClient = algoliasearch(ALGOLIA_APP_ID, '293c4b5a4851d9d0a1fd62f4abd62721');
	const index = algoliaClient.initIndex(indexName);

	const search = useCallback(async () => {
		if (searchState.query.trim() === '') {
			setSearchState({ ...searchState, hits: [] });
			return;
		}

		try {
			const results = await index.search<Hit>(searchState.query);
			setSearchState(results);
		} catch (e) {
			console.error('Error searching Algolia index:', e);
		}
	}, [index, searchState]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				await search();
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();

		console.log('in here', indexName);
		return () => {
			console.log('returning');
		};
	});

	return searchState;
}
