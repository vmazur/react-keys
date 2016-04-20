import {_activeKeyBinder} from './redux/actions';

export const execCb = (func, nextEl, _this, props) => {
  if (!func) return;
  if (props && props.context) {
    func.call(_this, nextEl || {}, props.context);
  } else {
    func.call(_this, nextEl || {});
  }
};

export const exitTo = (callback) => {
  if (callback) {
    if (typeof callback === 'string') {
      _activeKeyBinder(callback);
    } else {
      callback();
    }
  }
};
