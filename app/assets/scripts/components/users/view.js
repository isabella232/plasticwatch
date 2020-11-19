import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/users';
import { wrapApiResult, getFromState } from '../../redux/utils';
import { getUTCDate } from '../../utils/date';

import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';
import { ScrollWrap } from '../../styles/table';

import App from '../common/app';
import UhOh from '../uhoh';
import { InnerPanel, Panel, PanelStats, PanelStat } from '../../styles/panel';

const FullPagePanel = styled(Panel)`
  ${InnerPanel} {
    max-height: none;
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
    grid-template-columns: 1fr;
    grid-gap: 2rem;
    height: 100vh;
    overflow: hidden;
    width: max-content;
    ${InnerPanel} {
      max-height: calc(100vh - 6rem);
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
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  list-style: none;
`;

const BadgeItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  ${media.mediumUp`
    align-items: flex-start;
  `}
`;

const BadgeName = styled.h3`
  font-size: 1rem;
  color: ${themeVal('color.secondary')};
  letter-spacing: 0.25px;
  text-transform: uppercase;
  vertical-align: middle;
  position: relative;
  text-align: center;
  margin: 0.5rem 0;

  span {
    display: block;
    font-size: 0.75rem;
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.baseMed')};
  }
`;

const BadgeHolder = styled.span`
  background: linear-gradient(135deg, ${themeVal('color.primary')}, ${themeVal('color.base')} 75%);
  border-radius: 50%;
  position: relative;
  width: 160px;
  height: 160px;
`;

const BadgeImg = styled.img`
  border-radius: 50%;
  border: 0.125rem solid ${themeVal('color.surface')};
  position: absolute;
  width: 88%;
  top: 6%;
  left: 6%;
`;

function UserView(props) {
  // Fetch user on page load
  useEffect(() => {
    props.fetchUser(props.match.params.id);
  }, []);

  // Get user data, if available
  if (!props.user.isReady()) return <></>;
  if (props.user.hasError()) return <UhOh />;
  const user = props.user.getData();
  const { badges, observations, gravatar } = user;

  const lastSurveyDate = observations
    .map((o) => o.createdAt)
    .sort()
    .pop();

  const campaignsCount = Array.from(
    new Set(observations.map((o) => o.campaignId))
  ).length;

  const profileImageSrc = gravatar
    ? `https://www.gravatar.com/avatar/${gravatar}?s=200`
    : `https://via.placeholder.com/150/EDEDED/3D4B74?text=${user.displayName}`;

  return (
    <App pageTitle='User Profile'>
      <FullPagePanel>
        <InnerPanel>
          <UserInfo>
            <UserName>{user.displayName}</UserName>
            <Avatar src={profileImageSrc} />
            <UserData>
              {observations.length === 0 ? (
                <PanelStat>
                  <span>No surveys yet</span>
                </PanelStat>
              ) : (
                <>
                  <PanelStat>
                    <span>Last Survey</span>
                    {getUTCDate(lastSurveyDate)}
                  </PanelStat>
                  {/* The below stat can be re-enabled once campaigns are passed down to the user profile route
                  <PanelStat>
                    <span>Last surveyed in</span>
                    {campaigns.name}
                  </PanelStat> */}
                </>
              )}
            </UserData>
          </UserInfo>
          <PanelStats>
            <PanelStat>
              {observations.length}
              <span>surveys</span>
            </PanelStat>
            <PanelStat>
              {campaignsCount}
              <span>campaigns contributed</span>
            </PanelStat>
            <PanelStat>
              {badges.length}
              <span>Earned Badges</span>
            </PanelStat>
          </PanelStats>
          <h2>Badges</h2>
          <ScrollWrap>
            {badges.length === 0 ? (
              <div>This user has not yet earned any badges.</div>
            ) : (
              <BadgeGrid>
                {badges.map((b) => (
                  <BadgeItem key={b.id}>
                    <BadgeHolder>
                      <BadgeImg src={`data:image/svg+xml;base64,${b.image}`} />
                    </BadgeHolder>
                    <BadgeName>
                      {b.name}
                      <span>Level {b.description.level}</span>
                    </BadgeName>
                    <p>{b.description.text}</p>
                  </BadgeItem>
                ))}
              </BadgeGrid>
            )}
          </ScrollWrap>
        </InnerPanel>
      </FullPagePanel>
    </App>
  );
}

if (environment !== 'production') {
  UserView.propTypes = {
    fetchUser: T.func,
    match: T.object,
    user: T.object
  };
}

function mapStateToProps(state, props) {
  const { id } = props.match.params;

  return {
    user: wrapApiResult(getFromState(state, `users.individual.${id}`))
  };
}

function dispatcher(dispatch) {
  return {
    fetchUser: (...args) => dispatch(actions.fetchUser(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(UserView);
