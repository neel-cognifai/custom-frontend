export interface SearchResponse {
    results: [];
    loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
}

export interface IPayload {
    values: {
      search: string;
    };
    perPage: number
    PageNumber: number
    filters: {
      start_date: Date;
      end_date: Date | null;
    };
}

export interface Citation {
  id: number;
  title: string;
  abstract: string;
  keywords?: string[] | null;
  updated_on: string;
  published_on: string;
  country: string;
  author: string;
  doi_sources: string;
  affiliation: string;
  language: string;
  citation: string;
  file_name: string;
  pmid: number;
  publication_types: string
  mesh_terms: string[]
}

export interface PreMonitorFilter {
  id: string;
  filter_type: string;
  params: {
    search_query: string;
    start_date: string;
    end_date: string;
  };
  created_on: string;
  modified_on: string;
}

export interface FilterPayload  {
  values : {
    search: string
  }
  filters: {
    start_date: string;
    end_date: string
  }
}

export interface DataObject {
  citation: Citation[];
  pre_monitor_filter: PreMonitorFilter;
  count: number;
}

export interface IMonitorPayload {
  pre_monitor_id?: string;
  name: string;
  description: string;
  purpose: string;
  frequency?: string;
  from_date: string;
  to_date: string;
  abstract_team_id: string | undefined;
  qc_team_id: string | undefined;
  non_english: boolean;
  is_animal_invitro: boolean;
  is_publish_before_mah_date: boolean;
  is_without_tag: boolean;
  mah_date?: string;
  origin_countries: string[];
  query_params?: any
}
  