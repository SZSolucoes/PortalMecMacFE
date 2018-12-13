import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import Veiculos from '../components/veiculos/Veiculos';
import CadastrosBasicos from '../components/cadastrosbasicos/CadastrosBasicos';
import ItemManutencao from '../components/cadastrosbasicos/itemmanutencao/ItemManutencao';
import Aros from '../components/cadastrosbasicos/aros/CBAros';
import Complementos from '../components/complementos/Complementos';
import Parametros from '../components/parametros/Parametros';

export default props => (
    <Switch>
        <Route exact path='/' component={Veiculos} />
        <Route exact path='/veiculos' component={Veiculos} />
        <Route exact path='/cadastrosbasicos' component={CadastrosBasicos} />
        <Route exact path='/cadastrosbasicos/itemmanutencao' component={ItemManutencao} />
        <Route exact path='/cadastrosbasicos/aros' component={Aros} />
        <Route exact path='/parametros' component={Parametros} />
        <Route exact path='/complementos' component={Complementos} />
        <Route component={Veiculos} />
        <Redirect from='*' to='/' />
    </Switch>
);

