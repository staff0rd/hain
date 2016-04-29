'use strict';

import React from 'react';
import { TextField } from 'material-ui';

const utils = require('../utils');

class NumberComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      val: props.model || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      val: nextProps.model || 0
    });
  }

  handleChange(evt, val) {
    let _val = val;
    if (_val.length === 0)
      _val = '0';

    const incomleteRegEx = /^\d+.?\d*$/;
    if (!incomleteRegEx.test(_val))
      return;

    this.setState({ val: _val });

    const completeRegEx = /^\d+(.\d+)?$/;
    if (!completeRegEx.test(_val))
      return;

    let num = Number(_val);
    if (isNaN(num))
      num = 0;

    const { onChange, path } = this.props;
    onChange(path, num);
  }

  render() {
    const { schema, name, path, errors } = this.props;
    const { val } = this.state;
    const error = utils.findErrorMessage(errors, path);
    let title = schema.title || name;
    const description = utils.wrapDescription(schema.description);

    if (title !== undefined) {
      title = (<h5 style={{ marginBottom: '2px' }}>{title}</h5>);
    }

    return (
      <div>
        {title}
        {description}
        <TextField name="number" value={val} errorText={error}
                   fullWidth={true}
                   onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

module.exports = NumberComponent;
