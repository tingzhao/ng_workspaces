import React from 'react';
import PropTypes from 'prop-types';
import PickerResults from './PickerResults';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = {
  window: {
    width: '90%',
    margin: 'auto',
    height: '500px',
  },
  textField: {
    width: '50%',
  },
  inputForm: {
    margin: '1em',
  },
};

class ImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverUrl: null,
      coordinates: '',
      submitted: false,
      results: null,
    };
  }

  initViewer = resp => {
    const {actions} = this.props;
    actions.initViewer({
      layers: {
        grayscale: {
          type: 'image',
          source: resp.dbsrc,
        },

        /*segmentation: {
          type: 'segmentation',
          source:
            'dvid://https://flyem.dvid.io/d925633ed0974da78e2bb5cf38d01f4d/segmentation',
          segments: ['208299761'],
        },*/
      },
      /*perspectiveZoom: 20,
      navigation: {
        zoomFactor: 8,
        pose: {
          position: {
            voxelSize: [8, 8, 8],
            voxelCoordinates: [7338.26953125, 7072, 4246.69140625],
          },
        },
      },*/
      layout: 'xz',
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {serverUrl} = this.state;
    // fetch server info, set state to true if successful
    fetch(serverUrl + '/info')
      .then(result => result.json())
      .then(response => {
        // json response encodes a neuroglancer source in "dbsrc"
        this.initViewer(response);
        this.setState({submitted: true});
      })
      .catch(() => {});
  };

  handleSearch = e => {
    e.preventDefault();
    const {serverUrl, coordinates} = this.state;
    let coord_array = coordinates.split(',');
    if (coord_array.length !== 3) {
      alert('Specify comma delimited x,y,z, coordinates');
      return;
    }

    // fetch server info, set state to true if successful
    // TODO: support pagination by setting skip accordingly
    // (currently: limits the number of results to 10, skips 0)
    fetch(serverUrl + '/findimages?skip=0&limit=10&coords=' + coordinates)
      .then(result => result.json())
      .then(response => {
        this.setState({results: response});
      })
      .catch(() => {});
  };

  render() {
    const {user, children, classes, actions} = this.props;
    const {serverUrl, submitted, results} = this.state;

    if (!submitted) {
      return (
        <div className={classes.inputForm}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="standard-name"
              label="ServerUrl"
              className={classes.textField}
              onChange={event => this.setState({serverUrl: event.target.value})}
              margin="normal"
            />
            <br />
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleSubmit}>
              Submit
            </Button>
          </form>
        </div>
      );
    }

    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">ImagePicker</Typography>
          {user.get('loggedIn') && (
            <p>logged in as: {user.get('userInfo').username}</p>
          )}
          {!user.get('loggedIn') && <p>Not logged in.</p>}
          <p>ServerUrl: {serverUrl}</p>
        </Grid>
        <Grid item xs={9}>
          <div className={classes.window}>{children}</div>
        </Grid>
        <Grid item xs={3}>
          <div className={classes.inputForm}>
            <form onSubmit={this.handleSearch}>
              <TextField
                id="coordinates"
                label="Coordinates"
                className={classes.textField}
                margin="normal"
                onChange={event =>
                  this.setState({coordinates: event.target.value})
                }
              />
              <br />
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleSearch}>
                Submit
              </Button>
            </form>
          </div>
          {results !== null && (
            <PickerResults results={results} actions={actions} />
          )}
        </Grid>
      </Grid>
    );
  }
}

ImagePicker.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImagePicker);
