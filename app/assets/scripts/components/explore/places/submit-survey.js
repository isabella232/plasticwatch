import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../../config';
import ReactTooltip from 'react-tooltip';

import * as actions from '../../../redux/actions/places';
import { wrapApiResult, getFromState } from '../../../redux/utils';

import {
  PlaceTitle
} from '../../../styles/place';
import Button from '../../../styles/button/button';
import InnerPanel from '../../../styles/inner-panel';
import Form from '../../../styles/form/form';
import FormTextarea from '../../../styles/form/textarea';

import { FormHelper, FormHelperMessage } from '../../../styles/form/helper';
import FormLegend from '../../../styles/form/legend';
import FormLabel from '../../../styles/form/label';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../../styles/form/group';
import {
  FormCheckableGroup,
  FormCheckable
} from '../../../styles/form/checkable';

class SubmitSurvey extends Component {
  async componentDidMount () {
    await this.fetchData();
  }

  async fetchData () {
    const { type, id } = this.props.match.params;
    const placeId = `${type}/${id}`;
    await this.props.fetchPlace(placeId);
  }

  render () {
    const { isReady, hasError, getData } = this.props.place;

    if (!isReady()) return <div>Loading...</div>;
    if (hasError()) {
      return <div>As error occurred when fetching place data</div>;
    }

    const { properties } = getData();

    return (
      <InnerPanel>
        <Form>
          <FormLegend>Name</FormLegend>
          {properties.name && <PlaceTitle>{properties.name}</PlaceTitle>}
          <FormGroup>
            <FormGroupHeader>
              <FormLabel>Restaurant Packaging Options</FormLabel>
            </FormGroupHeader>
            <FormHelper>
              <FormHelperMessage>
                Does the restaurant offer non-plastic take-away packaging
                options?
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
            data-tip='Submit survey'
          >
            Submit
          </Button>
          <Button
            variation='danger-raised-light'
            size='large'
            type='submit'
            data-tip='Cancel survey'
          >
            Cancel
          </Button>
          <ReactTooltip effect='solid' className='type-primary' />
        </Form>
      </InnerPanel>
    );
  }
}

if (environment !== 'production') {
  SubmitSurvey.propTypes = {
    place: T.object,
    match: T.object,
    fetchPlace: T.func
  };
}

function mapStateToProps (state, props) {
  const { type, id } = props.match.params;
  const placeId = `${type}/${id}`;

  return {
    place: wrapApiResult(getFromState(state, `places.individual.${placeId}`))
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlace: (...args) => dispatch(actions.fetchPlace(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(SubmitSurvey);
