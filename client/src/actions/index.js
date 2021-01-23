import accountsActions from './accounts';
import balancesActions from './balances';
import budgetsActions from './budgets';
import categoriesActions from './categories';
import itemsActions from './items';
import messagesActions from './messages';
import pendingActions from './pending';
import plannedActions from './planned';
import settingsActions from './settings';
import transactionsActions from './transactions';

export default {
  ...accountsActions,
  ...balancesActions,
  ...budgetsActions,
  ...categoriesActions,
  ...itemsActions,
  ...messagesActions,
  ...pendingActions,
  ...plannedActions,
  ...settingsActions,
  ...transactionsActions,
}
