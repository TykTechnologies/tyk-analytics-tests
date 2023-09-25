import { Template_Page } from './Template_Page';
import { Button_object } from '@wrappers/Button_object';
import { Checkbox_object } from '@wrappers/CheckBox_object';
import { Table_object } from '@wrappers/Table_object';
import { DropDown_object } from '@wrappers/DropDown_object';
import { Input_object } from '@wrappers/Input_object';
import { expect } from '@playwright/test';
import { SlowButton_object } from 'tyk-test-automation-wrappers/lib/SlowButton_object';

export class Users_page extends Template_Page {
  //MAIN PAGE
  get ADD_USER_BUTTON() { return new Button_object('span:text-is(" Add user")', this.page); }
  get USERS_TABLE() { return new Table_object('.tyk-table', this.page); }

  //ADD/EDIT USER PAGE
  get SAVE_BUTTON() { return new SlowButton_object(this.page.locator('span').filter({ hasText: 'Save' }), this.page); }
  get UPDATE_BUTTON() { return new SlowButton_object(this.page.locator('span').filter({ hasText: 'Update' }), this.page); }
  get DELETE_BUTTON() { return new Button_object(this.page.locator('span').filter({ hasText: 'Delete' }), this.page); }
  get FIRST_NAME_INPUT() { return new Input_object('input[name="first_name"]', this.page); }
  get LAST_NAME_INPUT() { return new Input_object('input[name="last_name"]', this.page); }
  get EMAIL_ADRESS_INPUT() { return new Input_object('input[name="email_address"]', this.page); }
  get PASSWORD_INPUT() { return new Input_object('input[name="password"]', this.page); }
  get ACCOUNT_IS_ACTIVE_CHECKBOX() { return new Checkbox_object('input[name=active]', this.page); }
  get ACCOUNT_IS_ADMIN_CHECKBOX() { return new Checkbox_object('input[name=admin]', this.page); }
  get USER_GROUP_DROPDOWN() { return new DropDown_object('.tyk-combobox2__text-value', this.page); }

  //PERMISSION
  get PERMISSIONS_ANALYTICS_ROW() { return this.page.locator(`input[name="user_permissions.analytics"]`).first(); }

  //MODALS
  get MODAL() { return this.page.locator('.opened .tyk-modal__content'); }
  get UPDATE_CONFIRMATION_BUTTON() { return this.page.locator('//div[@class="tyk-modal__content"]//button//span[text()="Update"]'); }
  get DELETE_CONFIRMATION_BUTTON() { return this.page.locator('//div[@class="tyk-modal__content"]//button//span[text()="Delete"]'); }
  get CONFIRM_BUTTON() { return this.page.locator('//div[contains(@class,"opened")]//div[@class="tyk-modal__content"]//button//span[text()="Confirm"]'); }

  get user_created_expected_mesage() { return 'User added successfully'; }
  get user_updated_expected_mesage() { return 'User updated successfully'; }
  get user_already_exists_expected_mesage() { return 'User email already exists for this Org'; }

  waitUntilPageLoaded() {
    return super.waitUntilPageLoaded(this.USERS_TABLE);
  }

  async checkIfUserCreatedPopUpDisplayed(): Promise<void> { return await this.isSuccessPopupDisplayedWithText(this.user_created_expected_mesage); }

  async checkIfUserUpdatedPopUpDisplayed(): Promise<void> { return await this.isSuccessPopupDisplayedWithText(this.user_updated_expected_mesage); }

  async checkIfUserAlreadyExistsPopUpDisplayed(): Promise<void> { return await this.isErrorPopupDisplayedWithText(this.user_already_exists_expected_mesage); }

  async selectReadAccessForPermission(permissionName: any) {
    const $$radioButtons = this.page.locator(`input[name="user_permissions.${permissionName}"]`);
    expect(await $$radioButtons.count()).toBeGreaterThan(1);
    await $$radioButtons.nth(1).waitFor();
    await $$radioButtons.nth(1).click();
    if (await $$radioButtons.nth(1).textContent() !== 'read') {
      await $$radioButtons.nth(1).click();
    }
    await expect($$radioButtons.nth(1)).toHaveValue('read');
  }
}