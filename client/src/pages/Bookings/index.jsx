import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { baseURL } from '../../utils';

import { AuthContext } from '../../context';
import RippleLoader from '../../components/common/RippleLoader';

export default class Bookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      bookings: [],
    }
  }

  static contextType = AuthContext;

  componentDidMount = () => {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `
      };
      const result = await fetch(`${baseURL}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.context.token,
        }
      });
      if (result.status === 200) {
        const formattedResponse = await result.json();
        const { bookings } = formattedResponse.data;
        console.log(bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Bookings</title>
        </Helmet>
        <div className="columns is-vcentered is-mobile is-multiline">
          <div className="column is-12 flex-center">
            {
              this.state.isLoading && 
              <Fragment>
                <h2 className="title has-text-centered has-text-weight-bold">Hold on! We're fetching your bookings...</h2>
                <RippleLoader height='100px' />
              </Fragment>
            }
          </div>

        </div>
      </Fragment>
    )
  }
}