import React from "react";
import { observer } from "mobx-react";
import { action, observable, computed, toJS, runInAction } from "mobx";
import Entry from "../components/Entry";
import styled from "styled-components";
import throttle from "lodash/throttle";
import findIndex from "lodash/findIndex";
import PageContainer from "../components/PageContainer";
import TripHeader from "../components/TripHeader";
import {
  compose,
  withProps,
  branch,
  renderComponent,
  lifecycle
} from "recompose";
import { withStore } from "../utils";

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  display: flex;

  height: 33vh;
`;

const EntriesContainer = styled.div`
  margin-top: 33vh;
  margin-bottom: 5vh;
  flex: 1;
  width: 100%;
`;

const BUFFER = 100;

@observer
class ShowTrip extends React.Component {
  @observable
  focusedEntryIndex = null;

  entryRefs = {};

  constructor(props) {
    super(props);

    // active, start at bottom
    // inactive, start at top
    this.focusedEntryIndex =
      props.trip.status === "active" ? this.props.trip.entries.length - 1 : 0;
    this.focusedEntryIndex = 0;
  }

  _spyOnScroll = () => {
    window.addEventListener(
      "scroll",
      throttle(() => {
        const windowHeight = window.innerHeight;
        const scrollPosition =
          document.documentElement.scrollTop || document.body.scrollTop;

        for (const [id, ref] of Object.entries(this.entryRefs)) {
          // console.log(id, ref.offsetTop);
          const intId = parseInt(id);

          if (
            ref.offsetTop >
            scrollPosition + (windowHeight * 2.0) / 3.0 - BUFFER
          ) {
            runInAction(() => {
              this.focusedEntryIndex = findIndex(
                this.props.trip.entries,
                e => e.id === intId
              );
              this._handleEntryFocused(this.focusedEntryIndex);
            });
            break;
          }
        }
      }, 150)
    );
  };

  // @computed
  // get newUnseenEntries() {
  //   return false;
  // }

  componentDidMount() {
    setTimeout(() => {
      this._focusEntry(this.focusedEntryIndex, false);
      this._spyOnScroll();
    }, 600);
  }

  // handler for tapping a map point
  @action
  _focusEntry = (entryIndex, scroll = true) => {
    // update index for rendering
    this.focusedEntryIndex = entryIndex;

    // update map
    this._handleEntryFocused(this.focusedEntryIndex);

    // scroll to entry
    if (scroll) {
      const ref = this.entryRefs[this.props.trip.entries[entryIndex].id];
      if (!ref) {
        console.log(
          `Warning: attempting to focusEntry ${entryIndex} without ref.`
        );
      }
      ref && ref.scrollIntoView({ behavior: "smooth" });
    }
  };

  // handler for scroll spy once it focuses a new entry
  _handleEntryFocused = entryIndex => {
    this.header && this.header.focusEntry(this.props.trip.entries[entryIndex]);
  };

  render() {
    return (
      <PageContainer>
        <FixedHeader>
          <TripHeader
            ref={r => (this.header = r)}
            title={this.props.trip.name}
            entries={this.props.trip.entries}
            actionComponent={"Live"}
            onEntryFocused={this._focusEntry}
          />
        </FixedHeader>
        <EntriesContainer innerRef={r => (this.entriesContainer = r)}>
          {this.props.trip.entries.map((e, i) => (
            <Entry
              key={e.id}
              innerRef={r => (this.entryRefs[e.id] = r)}
              {...e}
              focused={i === this.focusedEntryIndex}
            />
          ))}
        </EntriesContainer>
      </PageContainer>
    );
  }
}

const TripSkeleton = () => (
  <PageContainer>
    <FixedHeader>Loading...</FixedHeader>
    <EntriesContainer>Loading...</EntriesContainer>
  </PageContainer>
);

const withTrip = compose(
  withStore("store"),
  withProps(props => ({
    trip: toJS(props.store.trips[props.match.params.tripHandle])
  }))
);

const loadTrip = lifecycle({
  componentDidMount() {
    this.props.store._syncTrip(
      this.props.match.params.handle,
      this.props.match.params.tripHandle
    );
    this.uninstall = this.props.store._subscribeToTripEntries(
      this.props.match.params.tripHandle
    );
  },
  componentWillUnmount() {
    this.uninstall && this.uninstall();
  }
});

const requireTrip = branch(props => !props.trip, renderComponent(TripSkeleton));

export default compose(
  withTrip,
  loadTrip,
  requireTrip
)(ShowTrip);
