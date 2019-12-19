import React, { useRef } from 'react';
import './App.css';

import {
  Cell,
  Input,
  Prompt,
  Source,
  Outputs
} from "@nteract/presentational-components"

import 'codemirror/lib/codemirror.css'
import {UnControlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/mode/julia/julia'
import 'codemirror/mode/javascript/javascript'

class InputOutput extends React.Component {
  constructor (props) {
    super(props)

    this.evaluate = props.evaluate || eval
    this.nextCell = props.nextCell || function () {}


    this.state = {
      counter: props.id,
      out: null
    }
  }

  executeCell (ed, next) {
    const val = ed.getValue()
    const out = this.evaluate(val)
    this.setState({
      out: out
    })
    next && this.nextCell()
  }

  render() {
    return (
      <Cell isSelected>
        <Input>
          <Prompt counter={this.state.counter} />
          <Source language="julia">
            <CodeMirror
              value=''
              options={{
                mode: 'javascript', // change this to julia
                theme: 'default',
                lineNumbers: false,
                extraKeys: {
                  'Ctrl-Enter': (ed) => this.executeCell(ed),
                  'Cmd-Enter': (ed) => this.executeCell(ed),
                  'Shift-Enter': (ed) => this.executeCell(ed, true)
                }
              }}
            />
          </Source>
        </Input>
        <Outputs>
          {this.state.out}
        </Outputs>
      </Cell>
    )
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cells: [{id: 1}],
      active: 1
    }
  }

  evaluateCode(code) {
    // FIXME: this should call a Julia WASM handler
    return eval(code) // js eval
  }

  nextCell(cell) {
    console.log(cell);
    if (cell.id === this.state.cells.length) {
      this.addCell()
    }
    this.setState({
      active: cell.id + 1
    })
  }

  addCell() {
    this.setState({
      cells: [...this.state.cells, {id: this.state.cells.length + 1}]
    })
  }

  render() {
    return (
      <div>
      {
        this.state.cells.map(cell => {
          return (
            <InputOutput
              isActive={this.state.active == cell.id}
              key={cell.id}
              id={cell.id}
              evaluate={(code) => this.evaluateCode(code)}
              nextCell={() => this.nextCell(cell)}
            />
          )
        })
      }
      </div>
    )
  }
}

export default App;
