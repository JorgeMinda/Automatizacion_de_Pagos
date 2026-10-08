import { useState, useMemo } from 'react';
import { AuthContext } from '@wasp.sh/lib-auth/browser';
import styles from './Auth.module.css';
import './internal/auth-styles.css';
import { tokenObjToCSSVars } from "./internal/util";
import { LoginSignupForm } from './internal/common/LoginSignupForm';
import { MessageError, MessageSuccess } from './internal/Message';
const logoStyle = {
    height: '3rem'
};
function Auth({ state, appearance, logo, socialLayout = 'horizontal', additionalSignupFields }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const customStyle = useMemo(() => ({
        ...tokenObjToCSSVars('color', appearance?.colors ?? {}),
        ...tokenObjToCSSVars('font-size', appearance?.fontSizes ?? {}),
    }), [appearance]);
    const titles = {
        login: 'Log in to your account',
        signup: 'Create a new account',
    };
    const title = titles[state];
    const socialButtonsDirection = socialLayout === 'vertical' ? 'vertical' : 'horizontal';
    return (<div className={styles.container} style={customStyle}>
      <div>
        {logo && (<img style={logoStyle} src={logo} alt='Your Company'/>)}
        <h2 className={styles.headerText}>{title}</h2>
      </div>

      {errorMessage && (<MessageError>
          {errorMessage.title}{errorMessage.description && ': '}{errorMessage.description}
        </MessageError>)}
      {successMessage && <MessageSuccess>{successMessage}</MessageSuccess>}
      <AuthContext.Provider value={{ isLoading, setIsLoading, setErrorMessage, setSuccessMessage }}>
        {(state === 'login' || state === 'signup') && (<LoginSignupForm state={state} socialButtonsDirection={socialButtonsDirection} additionalSignupFields={additionalSignupFields}/>)}
      </AuthContext.Provider>
    </div>);
}
// PRIVATE API
export default Auth;
//# sourceMappingURL=Auth.jsx.map