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

function Users(props) {
  // Fetch user on page load
  useEffect(() => {
    props.fetchUser(props.match.params.id);
  }, []);

  // Get user data, if available
  if (!props.user.isReady()) return <></>;
  if (props.user.hasError()) return <UhOh />;
  const user = props.user.getData();
  const { badges, observations } = user;

  const lastSurveyDate = observations
    .map((o) => o.createdAt)
    .sort()
    .pop();

  const campaigns = [
    { slug: 'washington-dc', id: 1, name: 'Washington DC' },
    { slug: 'boston', id: 1, name: 'Boston' }
  ];

  return (
    <App pageTitle='Users'>
      <TwoPanelLayout>
        <InnerPanel>
          <UserInfo>
            <UserName>{user.displayName}</UserName>
            <Avatar src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200' />
            <UserData>
              {observations.length === 0 ? (
                <PanelStat><span>No surveys yet</span></PanelStat>
              ) : (
                <>
                  <PanelStat>
                    <span>Last Survey</span>
                    {getUTCDate(lastSurveyDate)}
                  </PanelStat>
                  <PanelStat>
                    <span>Last surveyed in</span>
                    {campaigns.name}
                  </PanelStat>
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
              {campaigns.length}
              <span>campaigns contributed</span>
            </PanelStat>
            <PanelStat>
              {badges.length}
              <span>Earned Badges</span>
            </PanelStat>
          </PanelStats>
        </InnerPanel>
        <InnerPanel>
          <h2>Badges</h2>
          <ScrollWrap>
            {badges.length === 0 ? (
              <div>No badges were earned by this user yet.</div>
            ) : (
              <BadgeGrid>
                {badges.map((b) => (
                  <BadgeItem key={b.id}>
                    <BadgeImg src={b.image} />
                    <BadgeName>{b.title}</BadgeName>
                    <p>{b.description}</p>
                  </BadgeItem>
                ))}
              </BadgeGrid>
            )}
          </ScrollWrap>
        </InnerPanel>
      </TwoPanelLayout>
    </App>
  );
}

if (environment !== 'production') {
  Users.propTypes = {
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

export default connect(mapStateToProps, dispatcher)(Users);
