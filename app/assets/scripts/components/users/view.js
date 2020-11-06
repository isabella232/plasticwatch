import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { environment } from '../../config';
import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';
import { ScrollWrap } from '../../styles/table';

import App from '../common/app';
import { InnerPanel, Panel, PanelStats, PanelStat } from '../../styles/panel';

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
    grid-template-columns: 1fr 2fr;
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

const UserInfo = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  ${media.mediumUp`
    flex-flow: row wrap;
  `}
`;

const UserName = styled.h2`
  flex-basis: 100%;
  text-align: center;
  ${media.mediumUp`
    text-align: left;
  `}
`;

const Avatar = styled.img`
  margin-right: 1rem;
  border-radius: 50%;
  max-width: 150px;
  border: 0.5rem solid ${themeVal('color.shadow')};
`;

const UserData = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex: 1;
  ${media.mediumUp`
    flex-flow: column nowrap;
  `}
  ${PanelStat} {
    border-right: none;
  }
`;

const BadgeGrid = styled.ul`
  display: grid;
  margin: 1rem 0;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(225px, 1fr));
  list-style: none;
`;

const BadgeItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${media.mediumUp`
    align-items: flex-start;
  `}
`;

const BadgeName = styled.p`
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.regular')};
  color: ${themeVal('color.secondary')};
  letter-spacing: 0.25px;
  text-transform: uppercase;
  vertical-align: middle;
  position: relative;
  text-align: left;
  margin: 0.5rem 0;
`;

const BadgeImg = styled.img`
  border-radius: 50%;
  border: 0.125rem solid ${themeVal('color.primary')};
`;

function Users() {
  const user = {
    name: 'Juliana Castillo',
    location: 'Washington DC',
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
      title: 'Badge 1',
      description: 'This badge is earned by mapping plastic-free locations'
    },
    {
      id: 'badge-2',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 2',
      description: 'This badge is earned by mapping plastic-free locations'
    },
    {
      id: 'badge-3',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 3',
      description: 'This badge is earned by mapping plastic-free locations'
    },
    {
      id: 'badge-4',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 4',
      description: 'This badge is earned by mapping plastic-free locations'
    },
    {
      id: 'badge-5',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 5',
      description: 'This badge is earned by mapping plastic-free locations'
    },
    {
      id: 'badge-6',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF',
      title: 'Badge 6',
      description: 'This badge is earned by mapping plastic-free locations'
    }
  ];

  return (
    <App pageTitle='Users'>
      <TwoPanelLayout>
        <InnerPanel>
          <UserInfo>
            <UserName>{user.name}</UserName>
            <Avatar src={user.profilePic} />
            <UserData>
              <PanelStat>
                <span>City</span>
                {user.location}
              </PanelStat>
              <PanelStat>
                <span>Last Survey</span>
                {user.lastSurvey}
              </PanelStat>
            </UserData>
          </UserInfo>
          <PanelStats>
            <PanelStat>
              {user.surveyCount}
              <span>surveys</span>
            </PanelStat>
            <PanelStat>
              {user.plasticFreeSurveyCount}
              <span>plastic free surveys</span>
            </PanelStat>
            <PanelStat>
              {user.campaignsCount}
              <span>campaign contributed</span>
            </PanelStat>
          </PanelStats>
        </InnerPanel>
        <InnerPanel>
          <h2>Badges</h2>
          <ScrollWrap>
            <h4>EARNED</h4>
            <BadgeGrid>
              {badges.map((b) => (
                <BadgeItem key={b.id}>
                  <BadgeImg src={b.image} />
                  <BadgeName>{b.title}</BadgeName>
                  <p>{b.description}</p>
                </BadgeItem>
              ))}
            </BadgeGrid>
          </ScrollWrap>
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
