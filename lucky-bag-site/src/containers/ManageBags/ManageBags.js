import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";
import classes from "./ManageBags.module.css";
import Controls from "../../components/Controls/Controls";
import ErrorMsg from "../../components/ErrorMsg/ErrorMsg";
import BagReport from "../../components/BagReport/BagReport";

class ManageBags extends Component {

  render() {

    return (

      <div className={classes.ManageBags}>
        <h1>Manage Lucky Bags</h1>
        <Controls
          luckyBagDrawContract={this.props.luckyBagDrawContract}
          luckyBagTokenContract={this.props.luckyBagTokenContract}
          gasPrice={this.props.gasPrice}
          defaultAccount={this.props.defaultAccount}
          waiting={this.props.waiting}
          providerIsSet={this.props.providerIsSet}
          connectionWaiting={this.props.connectionWaiting}
          onSetProviderFail={this.props.onSetProviderFail}
          onSetProvider={this.props.onSetProvider}
          onUpdateBags={this.props.onUpdateBags}
          onGeneralUpdateError={this.props.onGeneralUpdateError}
          onNoConnection={this.props.onNoConnection}
          closed={this.props.closed}
          onUntieBag={this.props.onUntieBag}
          onNoBagsToUntie={this.props.onNoBagsToUntie}
          untied={this.props.untied}
          onOpenBag={this.props.onOpenBag}
          onNoBagsToOpen={this.props.onNoBagsToOpen}
        />
        <ErrorMsg
          connectionError={this.props.connectionError}
          mmInstalled={this.props.mmInstalled}
          generalError={this.props.generalError}
          manageBagsMsg={this.props.manageBagsMsg}
        />
        <BagReport
          closed={this.props.closed}
          closedWaiting={this.props.closedWaiting}
          closedError={this.props.closedError}
          untied={this.props.untied}
          untiedWaiting={this.props.untiedWaiting}
          untiedError={this.props.untiedError}
          opened={this.props.opened}
          openedWaiting={this.props.openedWaiting}
          openedError={this.props.openedError}
          prizes={this.props.prizes}
          prizesWaiting={this.props.prizesWaiting}
          prizesError={this.props.prizesError}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {

  return {
    txConnectError: state.manageBags.connectionError,
    manageBagsMsg: state.manageBags.manageBagsMsg,
    closed: state.manageBags.closed,
    untied: state.manageBags.untied,
    opened: state.manageBags.opened,
    prizes: state.manageBags.prizes,
    closedWaiting: state.manageBags.closedWaiting,
    untiedWaiting: state.manageBags.untiedWaiting,
    openedWaiting: state.manageBags.openedWaiting,
    prizesWaiting: state.manageBags.prizesWaiting,
    connectionError: state.manageBags.connectError ||
                     state.setProvider.connectionError,
    closedError: state.manageBags.closedError,
    untiedError: state.manageBags.untiedError,
    openedError: state.manageBags.openedError,
    prizesError: state.manageBags.prizesError,
    generalError: state.manageBags.generalError,
    providerIsSet: state.setProvider.providerIsSet,
    mmInstalled: state.setProvider.mmInstalled,
    connectionWaiting: state.setProvider.connectionWaiting,
    waiting: state.manageBags.closedWaiting || state.manageBags.untiedWaiting ||
             state.manageBags.openedWaiting || state.manageBags.prizesWaiting ||
             state.setProvider.connectionWaiting ||
             state.manageBags.untieWaiting || state.manageBags.openWaiting,
     luckyBagDrawContract: state.setProvider.luckyBagDrawContract,
     luckyBagTokenContract: state.setProvider.luckyBagTokenContract,
     gasPrice: state.setProvider.gasPrice,
     defaultAccount: state.setProvider.defaultAccount
  };
};

const mapDispatchToProps = dispatch => {

  return {
    onSetProviderFail: (error) => dispatch(actions.setProviderFail(error)),
    onSetProvider: () => dispatch(actions.setProvider()),
    onUpdateBags: (providerIsSet,
                   waiting,
                   txInput) => dispatch(actions.updateBags(providerIsSet,
                                                           waiting,
                                                           txInput)),
    onNoBagsToUntie: () => dispatch(actions.noBagsToUntie()),
    onNoBagsToOpen: () => dispatch(actions.noBagsToOpen()),
    onUntieBag: (providerIsSet,
                 waiting,
                 txInput) => dispatch(actions.untieBag(providerIsSet,
                                                       waiting,
                                                       txInput)),
    onOpenBag: (providerIsSet,
                waiting,
                txInput) => dispatch(actions.openBag(providerIsSet,
                                                     waiting,
                                                     txInput)),
    onGeneralUpdateError: (error) => dispatch(actions.generalError(error)),
    onNoConnection: () => dispatch(actions.noConnection())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBags);
