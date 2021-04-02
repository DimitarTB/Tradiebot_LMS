import { List } from '@material-ui/core'
import React, { useState } from 'react'
import { Fragment } from 'react'

function PlastfixForm2() {
    const [checkedIndex1, setCheckedIndex1] = useState(0)
    const [checkedIndex2, setCheckedIndex2] = useState(0)
    const [checkedIndex3, setCheckedIndex3] = useState(0)
    // const [checkedIndex1, setCheckedIndex1] = useState(0)


    return (
        <Fragment>
            <form>
                <h2>What is your longest time employed?</h2>
                <div className="radio">
                    <input type="radio" onClick={() => setCheckedIndex1(0)} name="3m" value="3m" checked={checkedIndex1 === 0 ? true : false} /><label for="3m">3 months</label>
                    <input type="radio" onClick={() => setCheckedIndex1(1)} name="6m" value="6m" checked={checkedIndex1 === 1 ? true : false} /><label for="6m">6 months</label>
                    <input type="radio" onClick={() => setCheckedIndex1(2)} name="12m" value="12m" checked={checkedIndex1 === 2 ? true : false} /><label for="12m">12 months</label>
                    <input type="radio" onClick={() => setCheckedIndex1(3)} name="3y" value="3y" checked={checkedIndex1 === 3 ? true : false} /><label for="3y">3+ years</label>
                    <input type="radio" onClick={() => setCheckedIndex1(4)} name="5y" value="5y" checked={checkedIndex1 === 4 ? true : false} /><label for="5y">5+ years</label>
                    <input type="radio" onClick={() => setCheckedIndex1(5)} name="10y" value="10y" checked={checkedIndex1 === 5 ? true : false} /><label for="10y">10+ years</label>
                </div>

                <h2>When were you last employed?</h2>
                <div className="radio">
                    <input type="radio" onClick={() => setCheckedIndex2(0)} name="3ma" value="3ma" checked={checkedIndex2 === 0 ? true : false} /><label for="3m">3 months ago</label>
                    <input type="radio" onClick={() => setCheckedIndex2(1)} name="6ma" value="6ma" checked={checkedIndex2 === 1 ? true : false} /><label for="6m">6 months ago</label>
                    <input type="radio" onClick={() => setCheckedIndex2(2)} name="12ma" value="12ma" checked={checkedIndex2 === 2 ? true : false} /><label for="12m">12 months ago</label>
                    <input type="radio" onClick={() => setCheckedIndex2(3)} name="3ya" value="3ya" checked={checkedIndex2 === 3 ? true : false} /><label for="3y">3+ years ago</label>
                    <input type="radio" onClick={() => setCheckedIndex2(4)} name="5ya" value="5ya" checked={checkedIndex2 === 4 ? true : false} /><label for="5y">5+ years ago</label>
                    <input type="radio" onClick={() => setCheckedIndex2(5)} name="10ya" value="10ya" checked={checkedIndex2 === 5 ? true : false} /><label for="10y">10+ years</label>
                </div>

                <h2>What is your expected salary?</h2>
                <div className="radio">
                    <input type="radio" onClick={() => setCheckedIndex3(0)} name="40" value="40" checked={checkedIndex3 === 0 ? true : false} /><label for="3m">$40.000</label>
                    <input type="radio" onClick={() => setCheckedIndex3(1)} name="50" value="50" checked={checkedIndex3 === 1 ? true : false} /><label for="6m">$50.000</label>
                    <input type="radio" onClick={() => setCheckedIndex3(2)} name="70" value="70" checked={checkedIndex3 === 2 ? true : false} /><label for="12m">$70.000</label>
                    <input type="radio" onClick={() => setCheckedIndex3(3)} name="80" value="80" checked={checkedIndex3 === 3 ? true : false} /><label for="3y">$80.000</label>
                    <input type="radio" onClick={() => setCheckedIndex3(4)} name="100" value="100" checked={checkedIndex3 === 4 ? true : false} /><label for="5y">$100.000</label>
                </div>
                <label for="skills">What are your core skills and attributes?</label><br />
                <select name="skills" id="skills" multiple>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>
            </form>
        </Fragment>
    )
}

export default PlastfixForm2
