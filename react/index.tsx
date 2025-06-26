/// <reference types="react" />
import React, { Component } from 'react'
import styles from './index.css'

type Props = {
  appPayload: string
}

type State = {
  loading: boolean
  paymentData: any
  showWalletInfo: boolean
}

class BasilcWeb3Pago extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    
    const paymentData = JSON.parse(this.props.appPayload)
    
    this.state = {
      loading: false,
      paymentData,
      showWalletInfo: false,
    }
  }

  componentDidMount() {
    // Remove payment loading to show the Payment App UI
    window.$(window).trigger('removePaymentLoading.vtex')
    console.log('Web3Pago Payment App loaded', this.state.paymentData)
  }

  respondTransaction = (status: boolean) => {
    window.$(window).trigger('transactionValidation.vtex', [status])
  }

  handleApprovePayment = () => {
    this.setState({ loading: true })
    
    // Simulate crypto payment approval
    console.log('Approving Web3Pago payment...', this.state.paymentData)
    
    // In a real implementation, here you would:
    // 1. Show wallet connection
    // 2. Request crypto payment
    // 3. Verify transaction on blockchain
    // 4. Call the approve endpoint
    
    setTimeout(() => {
      fetch(this.state.paymentData.approvePaymentUrl)
        .then(() => {
          console.log('Payment approved successfully')
          this.respondTransaction(true)
        })
        .catch(error => {
          console.error('Error approving payment:', error)
          this.setState({ loading: false })
        })
    }, 2000) // Simulate 2 second processing time
  }

  handleCancelPayment = () => {
    this.setState({ loading: true })
    
    fetch(this.state.paymentData.denyPaymentUrl)
      .then(() => {
        console.log('Payment cancelled')
        this.respondTransaction(false)
      })
      .catch(error => {
        console.error('Error cancelling payment:', error)
        this.setState({ loading: false })
      })
  }

  toggleWalletInfo = () => {
    this.setState({ showWalletInfo: !this.state.showWalletInfo })
  }

  render() {
    const { loading, paymentData, showWalletInfo } = this.state
    const amount = paymentData.amount / 100 // Convert from cents
    const currency = paymentData.currency || 'USD'

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2 className={styles.title}>Web3Pago - Crypto Payment</h2>
          
          <div className={styles.paymentInfo}>
            <p className={styles.amount}>
              Amount: {amount} {currency}
            </p>
            <p className={styles.crypto}>
              Pay with: {paymentData.web3pagoData?.cryptoCurrency || 'ETH'}
            </p>
          </div>

          <div className={styles.walletSection}>
            <button 
              className={styles.walletButton}
              onClick={this.toggleWalletInfo}
              disabled={loading}
            >
              {showWalletInfo ? 'Hide' : 'Show'} Wallet Details
            </button>
            
            {showWalletInfo && (
              <div className={styles.walletInfo}>
                <p><strong>Network:</strong> Ethereum Mainnet</p>
                <p><strong>Currency:</strong> {paymentData.web3pagoData?.cryptoCurrency || 'ETH'}</p>
                <p><strong>Status:</strong> Ready to pay</p>
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              id="payment-app-confirm"
              className={`${styles.button} ${styles.buttonSuccess}`}
              onClick={this.handleApprovePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Approve Payment'}
            </button>

            <button
              id="payment-app-cancel"
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={this.handleCancelPayment}
              disabled={loading}
            >
              Cancel Payment
            </button>
          </div>

          {loading && (
            <div className={styles.loadingMessage}>
              <p>Processing crypto payment...</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default BasilcWeb3Pago
