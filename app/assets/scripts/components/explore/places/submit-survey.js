import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../../config';
import ReactTooltip from 'react-tooltip';

import { fetchPlace } from '../../../redux/actions/places';
import { fetchSurveyMeta } from '../../../redux/actions/surveys';
import { wrapApiResult, getFromState, isLoggedIn } from '../../../redux/utils';

import toasts from '../../common/toasts';

import { PlaceTitle } from '../../../styles/place';
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

    if (!this.props.isLoggedIn) {
      toasts.info(`You must be logged in to submit surveys.`);
      this.props.history.push(`/explore/${placeId}`);
    } else {
      this.props.fetchPlaceAction(placeId);
      this.props.fetchSurveyMeta();
    }
  }

  renderQuestion (q) {
    return (
      <FormGroup>
        <FormGroupHeader>
          <FormLabel>{q.label}</FormLabel>
        </FormGroupHeader>
        <FormGroupBody>
          {q.type === 'boolean' && (
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
          )}
          {q.type === 'text' && (
            <FormTextarea
              size='large'
              id='textarea-1'
              placeholder='Description'
            />
          )}
        </FormGroupBody>
      </FormGroup>
    );
  }

  render () {
    const {
      isReady: isSurveyReady,
      hasError: hasSurveyError,
      getData: getSurveyData
    } = this.props.surveyMeta;

    if (!isSurveyReady()) return <div>Loading survey...</div>;
    if (hasSurveyError()) {
      return <div>As error occurred when fetching survey.</div>;
    }
    const surveyMeta = getSurveyData();
    if (!surveyMeta) return <div>No survey is available.</div>;
    const { questions } = surveyMeta;

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
          {questions.map(q => this.renderQuestion(q))}
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
    fetchPlaceAction: T.func,
    fetchSurveyMeta: T.func,
    history: T.object,
    isLoggedIn: T.bool,
    match: T.object,
    place: T.object,
    surveyMeta: T.object
  };
}

function mapStateToProps (state, props) {
  const { type, id } = props.match.params;
  const placeId = `${type}/${id}`;

  return {
    place: wrapApiResult(getFromState(state, `places.individual.${placeId}`)),
    surveyMeta: wrapApiResult(getFromState(state, `surveyMeta`)),
    isLoggedIn: isLoggedIn(state)
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlaceAction: (...args) => dispatch(fetchPlace(...args)),
    fetchSurveyMeta: (...args) => dispatch(fetchSurveyMeta(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(SubmitSurvey);
