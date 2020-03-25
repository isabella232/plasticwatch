import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { environment } from '../../../config';
import ReactTooltip from 'react-tooltip';
import { withFormik } from 'formik';

import { fetchPlace } from '../../../redux/actions/places';
import { fetchSurveyMeta, postSurvey } from '../../../redux/actions/surveys';
import { wrapApiResult, getFromState, isLoggedIn } from '../../../redux/utils';

import toasts from '../../common/toasts';

import { PlaceTitle } from '../../../styles/place';
import Button from '../../../styles/button/button';
import InnerPanel from '../../../styles/inner-panel';
import Form from '../../../styles/form/form';
import FormTextarea from '../../../styles/form/textarea';

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

const InnerSurveyForm = props => {
  const {
    values,
    setFieldValue,
    handleSubmit,
    handleChange,
    place,
    survey
  } = props;

  function renderQuestion (q) {
    const value = values[q.id];
    return (
      <FormGroup key={q.id}>
        <FormGroupHeader>
          <FormLabel>{q.label}</FormLabel>
        </FormGroupHeader>
        <FormGroupBody>
          {q.type === 'boolean' && (
            <FormCheckableGroup>
              <FormCheckable
                textPlacement='right'
                checked={value === true}
                type='radio'
                name='boolean-radio'
                id='radio-yes'
                onChange={() => setFieldValue(q.id, true)}
              >
                Yes
              </FormCheckable>
              <FormCheckable
                textPlacement='right'
                checked={value === false}
                type='radio'
                name='boolean-radio'
                id='radio-no'
                onChange={() => setFieldValue(q.id, false)}
              >
                No
              </FormCheckable>
            </FormCheckableGroup>
          )}
          {q.type === 'text' && (
            <FormTextarea
              size='large'
              id={q.id}
              placeholder='Description'
              onChange={handleChange}
              value={value}
            />
          )}
        </FormGroupBody>
      </FormGroup>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormLegend>Name</FormLegend>
      {place.name && <PlaceTitle>{place.name}</PlaceTitle>}
      {survey.questions.map(q => renderQuestion(q))}
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
        type='cancel'
        data-tip='Cancel survey'
      >
        Cancel
      </Button>
      <ReactTooltip effect='solid' className='type-primary' />
    </Form>
  );
};

if (environment !== 'production') {
  InnerSurveyForm.propTypes = {
    place: T.object,
    survey: T.object,
    values: T.object.isRequired,
    setFieldValue: T.func.isRequired,
    handleSubmit: T.func.isRequired,
    handleChange: T.func.isRequired
  };
}

const SurveyForm = withFormik({
  mapPropsToValues: props => {
    return props.survey.questions.reduce((values, q) => {
      let value;
      switch (q.type) {
        case 'boolean':
          value = undefined;
          break;
        default:
          value = '';
      }
      values[q.id] = value;
      return values;
    }, {});
  },

  handleSubmit: (values, { props }) => {
    props.handleSubmit(values);
  }
})(InnerSurveyForm);

class SubmitSurvey extends Component {
  constructor (props) {
    super(props);

    this.postSurvey = this.postSurvey.bind(this);
  }

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
      this.props.fetchPlace(placeId);
      this.props.fetchSurveyMeta();
    }
  }

  async postSurvey (data) {
    this.props.postSurvey(data);
  }

  render () {
    // Get place data
    const { isReady, hasError, getData } = this.props.place;
    if (!isReady()) return <div>Loading...</div>;
    if (hasError()) {
      return <div>As error occurred when fetching place data</div>;
    }
    const place = getData();

    // Get survey data
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

    return (
      <InnerPanel>
        <SurveyForm
          survey={surveyMeta}
          place={place.properties}
          handleSubmit={values =>
            this.postSurvey({
              surveyId: surveyMeta.id,
              osmObject: place,
              createdAt: new Date().toISOString(),
              answers: surveyMeta.questions.map(q => {
                return {
                  questionId: q.id,
                  questionVersion: q.version,
                  answer: {
                    value: values[q.id]
                  }
                };
              })
            })}
        />
      </InnerPanel>
    );
  }
}

if (environment !== 'production') {
  SubmitSurvey.propTypes = {
    fetchPlace: T.func,
    postSurvey: T.func,
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
    fetchPlace: (...args) => dispatch(fetchPlace(...args)),
    fetchSurveyMeta: (...args) => dispatch(fetchSurveyMeta(...args)),
    postSurvey: (...args) => dispatch(postSurvey(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(SubmitSurvey);
