import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'

export default class Footer extends Component {

  render () {
    return (
      <footer className='ext-footer'>
        <div className='footer container'>
          <div className='institutional'>
            <div className='logo gob'>
              <a href='/'>
                <img src='/ext/lib/site/footer/logo-footer.png' />
              </a>
            </div>
            <p className='text-muted small'>
              Desarrollado <a href="https://github.com/DemocraciaEnRed/xr-argentina">en código abierto</a> bajo la licencia bajo <a href='https://www.gnu.org/licenses/gpl-3.0-standalone.html'>GNU General Public License v3.0</a> por <a href="https://democraciaenred.org/">Democracia  en Red</a>
            </p>
          </div>
            <nav className='menu uppercase'>
              <Link to='/ayuda/como-funciona'>¿Cómo funciona?</Link>
              <Link to='/ayuda/acerca'>Acerca de este sitio</Link>
              <Link to='/ayuda/acerca'>Contacto</Link>
            </nav>
            <nav className='menu uppercase'>
              <Link to='/ayuda/terminos-y-condiciones'>{ t('help.tos.title')}</Link>
              <Link to='/ayuda/privacidad'>{ t('help.pp.title')}</Link>
            </nav>
        </div>
      </footer>
    )
  }
}
