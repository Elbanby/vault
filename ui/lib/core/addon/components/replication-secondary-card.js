import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../templates/components/replication-secondary-card';
import { clusterStates } from 'core/helpers/cluster-states';

/**
 * @module ReplicationSecondaryCard
 * The `ReplicationSecondaryCard` component is a card-like component.  It displays cluster mode details specific for DR and Performance Secondaries.
 *
 * @example
 * ```js
 * <ReplicationSecondaryCard
    @title='States'
    @replicationDetails={{replicationDetails}}
    />
 * ```
 * @param {String} [title=null] - The title to be displayed on the top left corner of the card.
 * @param {Object} replicationDetails=null - An Ember data object pulled from the Ember Model. It contains details specific to the mode's replication.
 */

export default Component.extend({
  layout,
  tagName: '',
  title: null,
  replicationDetails: null,
  state: computed('replicationDetails.{state}', function() {
    return this.replicationDetails && this.replicationDetails.state
      ? this.replicationDetails.state
      : 'unknown';
  }),
  connection: computed('replicationDetails.{connection_state}', function() {
    return this.replicationDetails.connection_state ? this.replicationDetails.connection_state : 'unknown';
  }),
  lastRemoteWAL: computed('replicationDetails.{lastRemoteWAL}', function() {
    return this.replicationDetails && this.replicationDetails.lastRemoteWAL
      ? this.replicationDetails.lastRemoteWAL
      : 0;
  }),
  inSyncState: computed('state', function() {
    // if our definition of what is considered 'synced' changes,
    // we should use the clusterStates helper instead
    return this.state === 'stream-wals';
  }),
  hasErrorClass: computed('replicationDetails', 'title', 'state', 'connection', function() {
    const { title, state, connection } = this;

    // only show errors on the state card
    if (title === 'Status') {
      const currentClusterisOk = clusterStates([state]).isOk;
      const primaryIsOk = clusterStates([connection]).isOk;
      return !(currentClusterisOk && primaryIsOk);
    }
    return false;
  }),
  knownPrimaryClusterAddrs: computed('replicationDetails.{knownPrimaryClusterAddrs}', function() {
    return this.replicationDetails.knownPrimaryClusterAddrs;
  }),
  primaryUiUrl: computed('replicationDetails.{primaries,knownPrimaryClusterAddrs}', function() {
    return this.replicationDetails.primaries.length && this.replicationDetails.primaries[0].api_address;
  }),
});
