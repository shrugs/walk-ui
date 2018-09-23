import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import mapboxgl from "mapbox-gl";

const toCoordinate = entry =>
  [entry.location.lng, entry.location.lat].map(parseFloat);

const HeaderText = styled.h1`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  text-align: left;
  text-transform: uppercase;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
  padding-left: 1rem;
  padding-right: 4rem;
`;

const AbsoluteContainer = styled.div`
  flex: 1;
  position: relative;
`;

const ActionButton = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;

  color: white;
  background-color: red;
  &:hover {
    background-color: blue;
  }

  border-radius: 1rem; // padding + half of font size = 1rem
  position: absolute;
  right: 2rem;
  bottom: -1rem;
`;

const MapContainer = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

mapboxgl.accessToken =
  "pk.eyJ1IjoibWF0dGNvbmRvbiIsImEiOiIzNjY3OWUwMzVjYjZiMTY2YzI3ZTcxMTE3MjRiMGRiNyJ9.U_ZjGoK1wy4HnzSBveI4UQ";

@observer
class TripHeader extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: "mapbox://styles/mapbox/light-v9",
        interactive: false,
        attributionControl: false,
        zoom: 13
      });
    }, 500);
  }

  componentDidUpdate() {
    // this.map &&
    //   this.map.fitBounds(this.calcBounds(), {
    //     padding: 20
    //   });
  }

  focusEntry = entry => {
    this.map &&
      this.map.flyTo({
        center: toCoordinate(entry),
        zoom: 13,
        speed: 5.0
      });
  };

  _handleEntryTapped = () => {
    // this.props.onEntryFocused(index);
  };

  _setRef = ref => {
    this.mapContainer = ref;
  };

  // calcBounds = () => {
  //   if (!this.props.entries.length) {
  //     return [[0, 0], [0, 0]];
  //   }

  //   const entries = this.props.entries;

  //   const first = toCoordinate(entries[0]);
  //   return entries
  //     .map(toCoordinate)
  //     .reduce(
  //       (bounds, coord) => bounds.extend(coord),
  //       new mapboxgl.LngLatBounds(first, first)
  //     );
  // };

  render() {
    return (
      <AbsoluteContainer>
        <MapContainer innerRef={this._setRef} />
        <HeaderText>{this.props.title}</HeaderText>
        <ActionButton onClick={this.props.onAction}>
          {this.props.actionComponent}
        </ActionButton>
      </AbsoluteContainer>
    );
  }
}

export default TripHeader;
