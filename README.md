# DashPay Point-Of-Sale

DashPay is a mobile-friendly point-of-sale app that merchants can use to accept Dash payments.

![alt text](https://github.com//kodaxx/dashpayPOS/raw/master/img/dashpayterminal.png "DashPay Terminal Mockup")

# Current Features

* Works on Andorid, iOS, Windows Phone - Mac, Windows, Linux
* Generate a new account on first run. Customize store name, create backups, etc.
* Enter sale amounts in your local currency (only supports USD at the moment) and have them converted to an amount in Dash using http://coinmarketcap.com exchange rate
* A QR code payment request is generated with your receiving address, sale amount, store name, and 'use InstantSend' for your customers to scan
* Unique addresses are used for every sale that are a part of your HD wallet. One private key
* ~~Get an on-screen notification when the requested amount is received at your address~~
* ~~Transactions and the exchange rate at the time of sale are recorded and can be viewed later~~

#Planned Features

* NFC touch-to-pay with mobile phones using Dash Wallet
* Offline payments system using plastic EMV-type cards for customers
* Ability to have payments converted to fiat instantly

# Installation

Pending

# License

#TO-DO before first release:

* Major code clean-up/refactoring
* Finish implementing current features
* Change from localStorage to localForage
* TEST and better error handling
* Cordova/PhoneGape builds
* Electron Builds

# TO-DO:

* Change from dashjs to bitcore

Copyright (C) 2016 kodaxx & nitya

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
