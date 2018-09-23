import { observable, runInAction } from "mobx";
import ActionCable from "actioncable";

class Store {
  wsBase = "ws://localhost:3001/ws";
  httpBase = "http://localhost:3001";
  cable = null;

  constructor() {
    this.cable = ActionCable.createConsumer(this.wsBase);
  }

  @observable
  trips = {};

  _syncTrip = async (userHandle, tripHandle) => {
    const res = await fetch(
      `${this.httpBase}/${userHandle}/trip/${tripHandle}`
    );
    const trip = await res.json();
    runInAction(() => {
      this.trips[trip.handle] = trip;
    });
  };

  _subscribeToTripEntries = tripHandle => {
    const sub = this.cable.subscriptions.create(
      {
        channel: "TripChannel",
        trip_handle: tripHandle
      },
      {
        connected: console.log,
        disconnected: console.error,
        rejected: console.log,
        received: ({ entry, trip_handle }) => {
          runInAction(() => {
            this.trips[trip_handle].entries.push(entry);
          });
        }
      }
    );

    return () => this.cable.subscriptions.remove(sub);
  };
}

export default new Store();
