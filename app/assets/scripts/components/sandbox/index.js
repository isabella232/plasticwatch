/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { rgba } from 'polished';

import App from '../common/app';
import SidePanel from '../../components/home/SidePanel';
import Map from '../../components/home/Map';
import media from '../../styles/utils/media-queries';
import InfoButton from '../../components/common/info-button';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';
import { visuallyHidden, listReset } from '../../styles/helpers/index';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
  InpageBackLink
} from '../common/inpage';

import Button from '../../styles/button/button';
import Form from '../../styles/form/form';
import FormLegend from '../../styles/form/legend';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import { FormCheckable, FormCheckableGroup } from '../../styles/form/checkable';
import FormTextarea from '../../styles/form/textarea';
import {
  FormHelper,
  FormHelperMessage
} from '../../styles/form/helper';
import {
  FilterToolbar,
  InputWrapper,
  InputWithIcon,
  InputIcon,
  FilterLabel,
  FilterButton
} from '../../styles/form/filters';

import DataTable from '../../styles/table'; 
import { cardSkin } from '../../styles/skins';

const _rgba = stylizeFunction(rgba);

const Wrapper = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 100vw;
  grid-template-rows: repeat(4, 1fr);
  margin-bottom: 3rem;
  > * {
      grid-column: 1;
    }
  > *:nth-of-type(2) {
    grid-row: 1/5;
  }
  ${media.mediumUp`
    grid-template-columns: 24rem 1fr;
    grid-template-rows: 1fr;
    margin: 0;
    > * {
      grid-row: 1;
      grid-column: initial;
    }
  `}
  ${media.largeUp`
    grid-template-columns: 36rem 1fr;
  `}
`;

const Panel = styled.section`
  position: relative; /* Likely change to fixed within grid */
  background: ${themeVal('color.background')};
  ${media.mediumUp`
    padding: 2rem;
  `}
`;

const InnerPanel = styled.article`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-between;
  margin: 2rem 0;
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 6px 1px ${themeVal('color.shadow')};
  padding: 1rem;
  ${media.mediumUp`
    padding: 1.5rem;
  `}
`;

const Results = styled.ul`
  ${listReset()};
`;

const ResultsItem = styled.li`
  margin-bottom: ${themeVal('layout.space')};
  max-width: 28rem;
  ${media.mediumUp`
    margin-bottom: 1.5rem;
  `}
`;

const Place = styled.article`
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 6px 1px ${themeVal('color.shadow')};
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  ${media.mediumUp`
    padding: 1.5rem;
  `}
`;

const PlaceHeader = styled.header`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  align-items: flex-start;
`;

const PlaceTitle = styled.h2`
  margin: 0;
`;

const PlaceType = styled.p`
  color: ${themeVal('color.baseMed')};
  line-height: 1;
`;

const PlaceRating = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-left: auto;
  padding-left: ${themeVal('layout.space')};
  text-align: center;
  color: ${themeVal('color.baseMed')};
`;

const RatingType = styled.p`
  font-weight: ${themeVal('type.base.bold')};
  font-size: 0.8rem;
  line-height: 1;
  &::before {
    display: block;
    ${({ useIcon }) => collecticon(useIcon)}
    color: ${({ nonplastic }) => nonplastic ? themeVal('color.primary') : themeVal('color.danger')};
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;
const PlaceSurveys = styled.p`
`;

const PlaceSelect = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  margin: 0 !important;
  transition: all 0.24s ease 0s;
  flex: none;
  &:hover {
    opacity: 1;
    background: ${_rgba(themeVal('color.primary'), 0.05)};
  }
  span {
    ${visuallyHidden()}
  }
`;

const PlaceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PlaceDetails = styled.div`
  margin-bottom: 2rem;
`;

const PlaceComment = styled.div``;

const PanelStats = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 2rem 0;
`;

const PanelStat = styled.h2`
  display: flex;
  flex-flow: column wrap;
  &:not(:last-child) {
    border-right: 1px solid ${themeVal('color.shadow')};
    margin-right: ${themeVal('layout.space')};
    padding-right: ${themeVal('layout.space')};
  }
  span {
    color: ${themeVal('color.baseLight')};
    font-size: 0.875rem;
    text-transform: uppercase;
    word-break: break-all;
  }
`;

class Sandbox extends React.Component {
  render () {
    return (
      <App pageTitle='Sandbox' hideFooter>
        <Inpage>
          <InpageHeader />
          <InpageBody>
            <InpageHeaderInner>
              <InpageHeadline>
                <InpageTitle>WikiPlastic Sandbox</InpageTitle>
              </InpageHeadline>
            </InpageHeaderInner>
            <InpageBodyInner>
              <Form>
                <FilterToolbar>
                  <InputWrapper>
                    <FilterLabel htmlFor='placeSearch'>Search places</FilterLabel>
                    <InputIcon htmlFor='placeSearch' useIcon='magnifier-left' />
                    <InputWithIcon
                      type='text'
                      id='placeSearch'
                      placeholder='Look up location'
                    />
                  </InputWrapper>
                  <Button useIcon='sliders-vertical'>Show Filters</Button>
                </FilterToolbar>
                <FilterToolbar>
                  <FilterButton>Plastic Free</FilterButton>
                  <FilterButton>Plastic</FilterButton>
                  <FilterButton>Unsurveyed</FilterButton>
                </FilterToolbar>
              </Form>
              <Results>
                <ResultsItem>
                  <Place>
                    <PlaceHeader>
                      <PlaceTitle>Scott's Salads</PlaceTitle>
                      <PlaceType>Cafe</PlaceType>
                    </PlaceHeader>
                    <PlaceRating>
                      <RatingType useIcon='circle-tick' nonplastic>Non-plastic options</RatingType>
                      <PlaceSurveys>12 out of 16 people</PlaceSurveys>
                    </PlaceRating>
                    <PlaceSelect />
                  </Place>
                </ResultsItem>
                <ResultsItem>
                  <Place>
                    <PlaceHeader>
                      <PlaceTitle>Bob's Burgers</PlaceTitle>
                      <PlaceType>Restaurant</PlaceType>
                    </PlaceHeader>
                    <PlaceRating>
                      <RatingType useIcon='circle-xmark'>No non-plastic options</RatingType>
                      <PlaceSurveys>14 out of 23 people</PlaceSurveys>
                    </PlaceRating>
                    <PlaceSelect />
                  </Place>
                </ResultsItem>
              </Results>
              <Panel>
                <InpageBackLink>Back to all restaurants</InpageBackLink>
                <InnerPanel>
                  <PlaceMeta>
                    <PlaceHeader>
                      <PlaceTitle>Bob's Burgers</PlaceTitle>
                      <PlaceType>Restaurant</PlaceType>
                      <Map />
                    </PlaceHeader>
                    <PlaceRating>
                      <RatingType useIcon='circle-xmark'>No non-plastic options</RatingType>
                      <PlaceSurveys>14 out of 23 people</PlaceSurveys>
                    </PlaceRating>
                  </PlaceMeta>
                  <PlaceDetails>
                    <h4>Recent Comments</h4>
                    <PlaceComment>This place is really great</PlaceComment>
                    <PlaceComment>I did not enjoy this restaurant</PlaceComment>
                  </PlaceDetails>
                  <Button
                    variation='primary-raised-dark'
                    size='large'
                  >
                    Submit survey
                  </Button>
                </InnerPanel>
              </Panel>
              <InnerPanel>
                <Form>
                  <FormLegend>Place Name</FormLegend>
                  <PlaceTitle>Bob's Burgers</PlaceTitle>
                  <FormGroup>
                    <FormGroupHeader>
                      <FormLabel>Restaurant Packaging Options</FormLabel>
                    </FormGroupHeader>
                    <FormHelper>
                      <FormHelperMessage>
                        Does the restaurant offer non-plastic take-away packaging options?
                      </FormHelperMessage>
                    </FormHelper>
                    <FormGroupBody>
                      <FormCheckableGroup>
                        <FormCheckable
                          textPlacement='right'
                          checked={undefined}
                          type='radio'
                          name='radio-a'
                          id='radio-yes'
                        >
                          Yes
                        </FormCheckable>
                        <FormCheckable
                          textPlacement='right'
                          checked={undefined}
                          type='radio'
                          name='radio-a'
                          id='radio-no'
                        >
                          No
                        </FormCheckable>
                      </FormCheckableGroup>
                    </FormGroupBody>
                  </FormGroup>
                  <FormGroup>
                    <FormGroupHeader>
                      <FormLabel htmlFor='textarea-1'>
                        Description of restaurant packaging
                      </FormLabel>
                    </FormGroupHeader>
                    <FormGroupBody>
                      <FormTextarea
                        size='large'
                        id='textarea-1'
                        placeholder='Description'
                      />
                    </FormGroupBody>
                  </FormGroup>
                  <Button
                    variation='primary-raised-dark'
                    size='large'
                    type='submit'
                  >
                    Submit
                  </Button>
                </Form>
              </InnerPanel>
              <InnerPanel>
                <h2>Washington DC</h2>
                <p>1776 restaurants surveyed</p>
                <p>75% of 2,377 restaurants on OpenStreetMap</p>
                <h3>81%</h3>
                <p>1438 Surveyed
                    Washington DC Restaurants
                    offer plastic-free options
                </p>
                <PanelStats>
                  <PanelStat>
                    1776
                    <span>Restaurants<br />Surveyed</span>
                  </PanelStat>
                  <PanelStat>
                    142
                    <span>Surveyors</span>
                  </PanelStat>
                  <PanelStat>
                    2123
                    <span>Restaurants to<br />Survey</span>
                  </PanelStat>
                  <PanelStat>
                    16
                    <span>Restaurants<br />Near You</span>
                  </PanelStat>
                </PanelStats>
                <Button useIcon='map' variation='base-raised-dark'>Show me the map</Button>
              </InnerPanel>
              <InnerPanel>
                <h2>Top Surveyors</h2>
                <DataTable>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Surveyor</th>
                      <th>Surveys</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Bob Smith</td>
                      <td>24</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Jane Good</td>
                      <td>19</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Matt Park</td>
                      <td>12</td>
                    </tr>
                  </tbody>
                </DataTable>
              </InnerPanel>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </App>
    );
  }
}

function mapStateToProps (state, props) {
  return {};
}

function dispatcher (dispatch) {
  return {};
}

export default connect(mapStateToProps, dispatcher)(Sandbox);
