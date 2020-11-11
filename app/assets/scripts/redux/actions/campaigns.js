import { fetchDispatchCacheFactory } from '../utils';
import { apiUrl } from '../../config';

/*
 * Fetch campaigns
 */

export const REQUEST_CAMPAIGNS = 'REQUEST_CAMPAIGNS';
export const RECEIVE_CAMPAIGNS = 'RECEIVE_CAMPAIGNS';
export const INVALIDATE_CAMPAIGNS = 'INVALIDATE_CAMPAIGNS';

export function invalidateCampaigns() {
  return { type: INVALIDATE_CAMPAIGNS };
}

export function requestCampaigns() {
  return { type: REQUEST_CAMPAIGNS };
}

export function receiveCampaigns(data, error = null) {
  return {
    type: RECEIVE_CAMPAIGNS,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchCampaigns() {
  return fetchDispatchCacheFactory({
    statePath: ['campaigns'],
    url: `${apiUrl}/campaigns`,
    requestFn: requestCampaigns.bind(this),
    receiveFn: receiveCampaigns.bind(this),
    mutator: (data) => {
      const campaigns = {};

      data.forEach((campaign) => (campaigns[campaign.slug] = campaign));
      return campaigns;
    }
  });
}
