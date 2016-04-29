'use strict';

import React from 'react';
import { Checkbox } from 'material-ui';


class BooleanComponent extends React.Component {
  handleCheck(obj, val) {
    const { onChange, path } = this.props;
    onChange(path, val);
  }

  render() {
    const { schema, model, name } = this.props;
    const title = schema.title || name;
    const checked = model || false;
    return (
      <div>
        <Checkbox name="check" label={title} checked={checked}
                  onCheck={this.handleCheck.bind(this)} />
      </div>
    );
  }
}

module.exports = BooleanComponent;
