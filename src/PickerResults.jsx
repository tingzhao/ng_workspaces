import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  window: {
    width: '90%',
    margin: 'auto',
  },
};

class PickerResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 0,
    };
  }

  render() {
    const {results, classes} = this.props;

    return (
      <div className={classes.window}>
        {results.length === 0 ? (
          <Typography variant="h5">No results</Typography>
        ) : (
          // results are a list of {"x","y","z","orientation","score"}
          // score = 1 is best match, score = 0 is bad match
          // stride is encoded as xsize, ysize, zsize (small dim defines the plane)
          <div>
            {results.map((entry, idx) => {
              return (
                <Typography key={idx}>
                  {entry.x.toString() +
                    ',' +
                    entry.y.toString() +
                    ',' +
                    entry.z.toString() +
                    ' match=' +
                    (entry.score * 100).toString()}
                </Typography>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

PickerResults.propTypes = {
  results: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

export default withStyles(styles)(PickerResults);
