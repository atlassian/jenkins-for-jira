import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';

const ALGOLIA_APP_ID = '8K6J5OJIQW';
const ALGOLIA_API_KEY = 'need_api_key';

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

const useAlgolia = ({ indexName }: UseAlgoliaProps) => {
	const [searchState, setSearchState] = useState<SearchState>({
		query: '',
		hits: []
	});

	const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
	const index = algoliaClient.initIndex(indexName);

	useEffect(() => {
		const search = async () => {
			if (searchState.query.trim() === '') {
				setSearchState({ ...searchState, hits: [] });
				return;
			}

			try {
				const { hits } = await index.search<Hit>(searchState.query);
				setSearchState({ ...searchState, hits });
			} catch (error) {
				console.error('Error searching Algolia index:', error);
			}
		};

		search();
	}, [searchState, searchState.query, index]);

	const handleSearch = (query: string) => {
		setSearchState({ ...searchState, query });
	};

	return { hits: searchState.hits, handleSearch };
};

export default useAlgolia;
