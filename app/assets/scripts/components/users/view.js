import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { environment } from '../../config';
import media from '../../styles/utils/media-queries';

import App from '../common/app';
import { InnerPanel, Panel } from '../../styles/panel';

const TwoPanelLayout = styled(Panel)`
  ${InnerPanel} {
    h2 {
      margin-bottom: 1rem;
    }
    margin: 0;
    &:not(:last-of-type) {
      margin-bottom: 2rem;
    }
  }
  ${media.mediumUp`
    display: grid;
    grid-gap: 2rem;
    height: 100vh;
    overflow: hidden;
    ${InnerPanel} {
      &:not(:last-of-type) {
        margin-bottom: 0;
      }
    }
  `};
`;

function Users() {
  const user = {
    name: 'Juliana Castillo',
    lastSurvey: '10/10/20',
    surveyCount: 18,
    plasticFreeSurveyCount: 7,
    campaignsCount: 1,
    profilePic:
      'https://via.placeholder.com/150/0000FF/FFFFFF?text=Profile%20Pic'
  };

  const badges = [
    {
      id: 'badge-1',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 1'
    },
    {
      id: 'badge-2',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 2'
    },
    {
      id: 'badge-3',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 3'
    },
    {
      id: 'badge-4',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 4'
    },
    {
      id: 'badge-5',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 5'
    },
    {
      id: 'badge-6',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 6'
    }
  ];

  return (
    <App pageTitle='Users'>
      <TwoPanelLayout>
        <InnerPanel>
          <h2>{user.name}</h2>
          <div>
            <img src={user.profilePic} />
            <h3>City</h3>
            <h3>Last Survey</h3>
            <p>{user.lastSurvey}</p>
          </div>
          <div>
            <p>{user.surveyCount} surveys</p>
            <p>{user.plasticFreeSurveyCount} plastic free surveys</p>
            <p>{user.campaignsCount} campaign contributed</p>
          </div>
          <div>
            <h3>Badges</h3>
            <ul>
              {badges.map((b) => (
                <li key={b.id}>
                  <img src={b.image} />
                  <span>{b.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </InnerPanel>
      </TwoPanelLayout>
    </App>
  );
}

if (environment !== 'production') {
  Users.propTypes = {};
}

function mapStateToProps(state) {
  return {};
}

function dispatcher(dispatch) {
  return {};
}

export default connect(mapStateToProps, dispatcher)(Users);
