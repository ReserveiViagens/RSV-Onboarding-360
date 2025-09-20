from pydantic import BaseModel
from typing import Optional

from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class PropertyBase(BaseModel):
    name: str
    address: str
    price_per_night: float
    description: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int

    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    property_id: int
    customer_id: int

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    status: str

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    sku: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True 

class TicketBase(BaseModel):
    event_name: str
    event_date: datetime
    price: float
    customer_id: int

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 

class ParkBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None

class ParkCreate(ParkBase):
    pass

class Park(ParkBase):
    id: int

    class Config:
        orm_mode = True 

class AttractionBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None

class AttractionCreate(AttractionBase):
    pass

class Attraction(AttractionBase):
    id: int

    class Config:
        orm_mode = True 

class InventoryItemBase(BaseModel):
    product_id: int
    quantity: int
    location: str
    sku: str

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItem(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 

class SaleBase(BaseModel):
    product_id: int
    sale_date: datetime
    amount: float
    customer_id: int

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int

    class Config:
        orm_mode = True 

class MarketingCampaignBase(BaseModel):
    name: str
    budget: float
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None

class MarketingCampaignCreate(MarketingCampaignBase):
    pass

class MarketingCampaign(MarketingCampaignBase):
    id: int

    class Config:
        orm_mode = True 

class AnalyticsBase(BaseModel):
    event_type: str
    event_name: str
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    page_url: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    properties: Optional[str] = None
    value: Optional[float] = None
    duration: Optional[int] = None

class AnalyticsCreate(AnalyticsBase):
    pass

class Analytics(AnalyticsBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class SEOBase(BaseModel):
    page_url: str
    title: str
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_tag: Optional[str] = None
    h2_tags: Optional[str] = None
    canonical_url: Optional[str] = None
    robots_txt: Optional[str] = "index,follow"
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: Optional[str] = "summary"
    structured_data: Optional[str] = None
    page_speed_score: Optional[int] = None
    mobile_friendly: Optional[bool] = True

class SEOCreate(SEOBase):
    pass

class SEO(SEOBase):
    id: int
    last_updated: datetime
    created_at: datetime

    class Config:
        orm_mode = True

class TranslationBase(BaseModel):
    key: str
    language_code: str
    text: str
    context: Optional[str] = None
    is_active: Optional[bool] = True

class TranslationCreate(TranslationBase):
    pass

class Translation(TranslationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class LanguageBase(BaseModel):
    code: str
    name: str
    native_name: str
    is_default: Optional[bool] = False
    is_active: Optional[bool] = True

class LanguageCreate(LanguageBase):
    pass

class Language(LanguageBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SubscriptionBase(BaseModel):
    user_id: int
    plan_name: str
    plan_type: str
    price: float
    status: Optional[str] = "active"
    end_date: Optional[datetime] = None
    auto_renew: Optional[bool] = True
    payment_method: Optional[str] = None
    features: Optional[str] = None

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int
    start_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SubscriptionPlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration_months: int
    features: Optional[str] = None
    is_active: Optional[bool] = True
    max_users: Optional[int] = None
    max_storage_gb: Optional[int] = None

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlan(SubscriptionPlanBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class GiftCardBase(BaseModel):
    code: str
    amount: float
    balance: float
    currency: Optional[str] = "USD"
    status: Optional[str] = "active"
    recipient_email: Optional[str] = None
    sender_name: Optional[str] = None
    sender_email: Optional[str] = None
    message: Optional[str] = None
    expires_at: Optional[datetime] = None
    used_at: Optional[datetime] = None

class GiftCardCreate(GiftCardBase):
    pass

class GiftCard(GiftCardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class GiftCardTransactionBase(BaseModel):
    gift_card_id: int
    transaction_type: str
    amount: float
    description: Optional[str] = None
    order_id: Optional[int] = None

class GiftCardTransactionCreate(GiftCardTransactionBase):
    pass

class GiftCardTransaction(GiftCardTransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class CouponBase(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    minimum_purchase: Optional[float] = None
    maximum_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    used_count: Optional[int] = 0
    user_limit: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: Optional[bool] = True
    description: Optional[str] = None
    applicable_products: Optional[str] = None
    applicable_categories: Optional[str] = None

class CouponCreate(CouponBase):
    pass

class Coupon(CouponBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CouponUsageBase(BaseModel):
    coupon_id: int
    user_id: int
    order_id: int
    discount_amount: float

class CouponUsageCreate(CouponUsageBase):
    pass

class CouponUsage(CouponUsageBase):
    id: int
    used_at: datetime

    class Config:
        orm_mode = True

class RewardBase(BaseModel):
    name: str
    description: Optional[str] = None
    points_required: int
    reward_type: str
    reward_value: float
    is_active: Optional[bool] = True
    max_redemptions: Optional[int] = None
    current_redemptions: Optional[int] = 0
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    image_url: Optional[str] = None

class RewardCreate(RewardBase):
    pass

class Reward(RewardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserRewardBase(BaseModel):
    user_id: int
    reward_id: int
    points_spent: int
    status: Optional[str] = "active"
    used_at: Optional[datetime] = None
    order_id: Optional[int] = None

class UserRewardCreate(UserRewardBase):
    pass

class UserReward(UserRewardBase):
    id: int
    redeemed_at: datetime

    class Config:
        orm_mode = True

class UserPointsBase(BaseModel):
    user_id: int
    points: Optional[int] = 0
    total_earned: Optional[int] = 0
    total_spent: Optional[int] = 0

class UserPointsCreate(UserPointsBase):
    pass

class UserPoints(UserPointsBase):
    id: int
    last_updated: datetime

    class Config:
        orm_mode = True

class PointsTransactionBase(BaseModel):
    user_id: int
    transaction_type: str
    points: int
    description: Optional[str] = None
    order_id: Optional[int] = None

class PointsTransactionCreate(PointsTransactionBase):
    pass

class PointsTransaction(PointsTransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class LoyaltyTierBase(BaseModel):
    name: str
    description: Optional[str] = None
    min_points: int
    max_points: Optional[int] = None
    benefits: Optional[str] = None
    discount_percentage: Optional[float] = 0.0
    free_shipping: Optional[bool] = False
    priority_support: Optional[bool] = False
    exclusive_offers: Optional[bool] = False
    is_active: Optional[bool] = True

class LoyaltyTierCreate(LoyaltyTierBase):
    pass

class LoyaltyTier(LoyaltyTierBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UserLoyaltyBase(BaseModel):
    user_id: int
    tier_id: int
    points_balance: Optional[int] = 0
    lifetime_points: Optional[int] = 0
    tier_expiry_date: Optional[datetime] = None
    status: Optional[str] = "active"

class UserLoyaltyCreate(UserLoyaltyBase):
    pass

class UserLoyalty(UserLoyaltyBase):
    id: int
    tier_start_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class LoyaltyTransactionBase(BaseModel):
    user_id: int
    transaction_type: str
    points: int
    description: Optional[str] = None
    order_id: Optional[int] = None
    campaign_id: Optional[int] = None

class LoyaltyTransactionCreate(LoyaltyTransactionBase):
    pass

class LoyaltyTransaction(LoyaltyTransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class LoyaltyCampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    points_multiplier: Optional[float] = 1.0
    bonus_points: Optional[int] = 0
    start_date: datetime
    end_date: datetime
    is_active: Optional[bool] = True
    applicable_tiers: Optional[str] = None

class LoyaltyCampaignCreate(LoyaltyCampaignBase):
    pass

class LoyaltyCampaign(LoyaltyCampaignBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    group_type: str
    max_members: Optional[int] = None
    is_private: Optional[bool] = False
    is_active: Optional[bool] = True
    created_by: int

class GroupCreate(GroupBase):
    pass

class Group(GroupBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class GroupMemberBase(BaseModel):
    group_id: int
    user_id: int
    role: Optional[str] = "member"
    status: Optional[str] = "active"
    invited_by: Optional[int] = None

class GroupMemberCreate(GroupMemberBase):
    pass

class GroupMember(GroupMemberBase):
    id: int
    joined_at: datetime

    class Config:
        orm_mode = True

class GroupInvitationBase(BaseModel):
    group_id: int
    invited_user_id: int
    invited_by: int
    status: Optional[str] = "pending"
    message: Optional[str] = None
    expires_at: Optional[datetime] = None

class GroupInvitationCreate(GroupInvitationBase):
    pass

class GroupInvitation(GroupInvitationBase):
    id: int
    created_at: datetime
    responded_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class GroupActivityBase(BaseModel):
    group_id: int
    activity_type: str
    description: Optional[str] = None
    user_id: Optional[int] = None
    related_id: Optional[int] = None

class GroupActivityCreate(GroupActivityBase):
    pass

class GroupActivity(GroupActivityBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: str
    document_type: str
    status: Optional[str] = "active"
    is_public: Optional[bool] = False
    uploaded_by: int
    related_user_id: Optional[int] = None
    related_booking_id: Optional[int] = None
    related_order_id: Optional[int] = None
    tags: Optional[str] = None
    metadata: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class DocumentVersionBase(BaseModel):
    document_id: int
    version_number: int
    file_name: str
    file_path: str
    file_size: int
    change_description: Optional[str] = None
    uploaded_by: int

class DocumentVersionCreate(DocumentVersionBase):
    pass

class DocumentVersion(DocumentVersionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class DocumentAccessBase(BaseModel):
    document_id: int
    user_id: int
    access_type: Optional[str] = "read"
    granted_by: int
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = True

class DocumentAccessCreate(DocumentAccessBase):
    pass

class DocumentAccess(DocumentAccessBase):
    id: int
    granted_at: datetime

    class Config:
        orm_mode = True

class DocumentTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    template_type: str
    file_path: str
    variables: Optional[str] = None
    is_active: Optional[bool] = True
    created_by: int

class DocumentTemplateCreate(DocumentTemplateBase):
    pass

class DocumentTemplate(DocumentTemplateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class DocumentSignatureBase(BaseModel):
    document_id: int
    user_id: int
    signature_type: Optional[str] = "digital"
    signature_data: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    is_valid: Optional[bool] = True

class DocumentSignatureCreate(DocumentSignatureBase):
    pass

class DocumentSignature(DocumentSignatureBase):
    id: int
    signed_at: datetime

    class Config:
        orm_mode = True

class VisaTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    country_code: str
    visa_category: str
    duration_days: int
    processing_time_days: int
    fee_amount: float
    fee_currency: Optional[str] = "USD"
    requirements: Optional[str] = None
    is_active: Optional[bool] = True

class VisaTypeCreate(VisaTypeBase):
    pass

class VisaType(VisaTypeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class VisaApplicationBase(BaseModel):
    visa_type_id: int
    user_id: int
    application_number: str
    status: Optional[str] = "pending"
    travel_purpose: str
    entry_date: datetime
    exit_date: datetime
    destination_city: str
    accommodation_address: Optional[str] = None
    emergency_contact: Optional[str] = None
    application_fee: float
    processing_fee: float
    total_fee: float
    payment_status: Optional[str] = "pending"
    rejection_reason: Optional[str] = None

class VisaApplicationCreate(VisaApplicationBase):
    pass

class VisaApplication(VisaApplicationBase):
    id: int
    submitted_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class VisaDocumentBase(BaseModel):
    application_id: int
    document_type: str
    file_name: str
    file_path: str
    file_size: int
    is_required: Optional[bool] = True
    is_verified: Optional[bool] = False
    verification_notes: Optional[str] = None

class VisaDocumentCreate(VisaDocumentBase):
    pass

class VisaDocument(VisaDocumentBase):
    id: int
    uploaded_at: datetime

    class Config:
        orm_mode = True

class VisaPaymentBase(BaseModel):
    application_id: int
    payment_method: str
    amount: float
    currency: Optional[str] = "USD"
    transaction_id: Optional[str] = None
    payment_status: Optional[str] = "pending"
    refund_amount: Optional[float] = None

class VisaPaymentCreate(VisaPaymentBase):
    pass

class VisaPayment(VisaPaymentBase):
    id: int
    payment_date: Optional[datetime] = None
    refund_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True

class VisaStatusBase(BaseModel):
    application_id: int
    status: str
    description: Optional[str] = None
    updated_by: Optional[int] = None

class VisaStatusCreate(VisaStatusBase):
    pass

class VisaStatus(VisaStatusBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class InsuranceTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    coverage_type: str
    coverage_amount: float
    premium_amount: float
    currency: Optional[str] = "USD"
    duration_days: int
    max_age: Optional[int] = None
    min_age: Optional[int] = None
    exclusions: Optional[str] = None
    benefits: Optional[str] = None
    is_active: Optional[bool] = True

class InsuranceTypeCreate(InsuranceTypeBase):
    pass

class InsuranceType(InsuranceTypeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class InsurancePolicyBase(BaseModel):
    policy_number: str
    insurance_type_id: int
    user_id: int
    status: Optional[str] = "active"
    start_date: datetime
    end_date: datetime
    coverage_amount: float
    premium_amount: float
    currency: Optional[str] = "USD"
    payment_status: Optional[str] = "pending"
    insured_persons: Optional[str] = None
    travel_destination: Optional[str] = None
    travel_dates: Optional[str] = None

class InsurancePolicyCreate(InsurancePolicyBase):
    pass

class InsurancePolicy(InsurancePolicyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class InsuranceClaimBase(BaseModel):
    claim_number: str
    policy_id: int
    user_id: int
    claim_type: str
    claim_amount: float
    currency: Optional[str] = "USD"
    status: Optional[str] = "submitted"
    description: str
    incident_date: datetime
    incident_location: Optional[str] = None
    police_report: Optional[str] = None
    medical_reports: Optional[str] = None
    receipts: Optional[str] = None
    approved_amount: Optional[float] = None
    rejection_reason: Optional[str] = None

class InsuranceClaimCreate(InsuranceClaimBase):
    pass

class InsuranceClaim(InsuranceClaimBase):
    id: int
    submitted_at: datetime
    processed_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class InsurancePaymentBase(BaseModel):
    policy_id: int
    payment_type: str
    amount: float
    currency: Optional[str] = "USD"
    payment_method: str
    transaction_id: Optional[str] = None
    payment_status: Optional[str] = "pending"

class InsurancePaymentCreate(InsurancePaymentBase):
    pass

class InsurancePayment(InsurancePaymentBase):
    id: int
    payment_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True

class InsuranceDocumentBase(BaseModel):
    policy_id: int
    claim_id: Optional[int] = None
    document_type: str
    file_name: str
    file_path: str
    file_size: int

class InsuranceDocumentCreate(InsuranceDocumentBase):
    pass

class InsuranceDocument(InsuranceDocumentBase):
    id: int
    uploaded_at: datetime

    class Config:
        orm_mode = True

class RefundRequestBase(BaseModel):
    refund_number: str
    user_id: int
    order_id: int
    booking_id: Optional[int] = None
    original_amount: float
    refund_amount: float
    currency: Optional[str] = "USD"
    reason: str
    refund_type: str
    status: Optional[str] = "pending"
    payment_method: str
    bank_account: Optional[str] = None
    refund_method: str
    processing_fee: Optional[float] = 0.0
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    approved_by: Optional[int] = None

class RefundRequestCreate(RefundRequestBase):
    pass

class RefundRequest(RefundRequestBase):
    id: int
    requested_at: datetime
    approved_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class RefundDocumentBase(BaseModel):
    refund_id: int
    document_type: str
    file_name: str
    file_path: str
    file_size: int

class RefundDocumentCreate(RefundDocumentBase):
    pass

class RefundDocument(RefundDocumentBase):
    id: int
    uploaded_at: datetime

    class Config:
        orm_mode = True

class RefundStatusBase(BaseModel):
    refund_id: int
    status: str
    description: Optional[str] = None
    updated_by: Optional[int] = None

class RefundStatusCreate(RefundStatusBase):
    pass

class RefundStatus(RefundStatusBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class RefundPolicyBase(BaseModel):
    name: str
    description: Optional[str] = None
    product_type: str
    refund_percentage: float
    time_limit_days: int
    conditions: Optional[str] = None
    is_active: Optional[bool] = True

class RefundPolicyCreate(RefundPolicyBase):
    pass

class RefundPolicy(RefundPolicyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SectorBase(BaseModel):
    name: str
    description: Optional[str] = None
    code: str
    category: str
    is_active: Optional[bool] = True

class SectorCreate(SectorBase):
    pass

class Sector(SectorBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SectorBudgetBase(BaseModel):
    sector_id: int
    fiscal_year: int
    budget_type: str
    amount: float
    currency: Optional[str] = "USD"
    description: Optional[str] = None
    approved_by: Optional[int] = None
    is_active: Optional[bool] = True

class SectorBudgetCreate(SectorBudgetBase):
    pass

class SectorBudget(SectorBudgetBase):
    id: int
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SectorTransactionBase(BaseModel):
    sector_id: int
    transaction_type: str
    amount: float
    currency: Optional[str] = "USD"
    description: Optional[str] = None
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None
    transaction_date: datetime
    category: Optional[str] = None
    payment_method: Optional[str] = None
    status: Optional[str] = "completed"

class SectorTransactionCreate(SectorTransactionBase):
    pass

class SectorTransaction(SectorTransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SectorReportBase(BaseModel):
    sector_id: int
    report_type: str
    report_period: str
    total_revenue: Optional[float] = 0.0
    total_expenses: Optional[float] = 0.0
    net_profit: Optional[float] = 0.0
    transaction_count: Optional[int] = 0
    average_transaction_value: Optional[float] = 0.0
    top_performing_category: Optional[str] = None
    generated_by: Optional[int] = None
    report_data: Optional[str] = None

class SectorReportCreate(SectorReportBase):
    pass

class SectorReport(SectorReportBase):
    id: int
    generated_at: datetime

    class Config:
        orm_mode = True

class SectorKPIBase(BaseModel):
    sector_id: int
    kpi_name: str
    kpi_value: float
    kpi_unit: Optional[str] = None
    target_value: Optional[float] = None
    measurement_date: datetime
    description: Optional[str] = None
    is_achieved: Optional[bool] = False

class SectorKPICreate(SectorKPIBase):
    pass

class SectorKPI(SectorKPIBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SectorForecastBase(BaseModel):
    sector_id: int
    forecast_type: str
    forecast_period: str
    predicted_value: float
    confidence_level: Optional[float] = None
    methodology: Optional[str] = None
    assumptions: Optional[str] = None
    created_by: Optional[int] = None

class SectorForecastCreate(SectorForecastBase):
    pass

class SectorForecast(SectorForecastBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AdminUserBase(BaseModel):
    user_id: int
    role: str
    permissions: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = True
    created_by: Optional[int] = None

class AdminUserCreate(AdminUserBase):
    pass

class AdminUser(AdminUserBase):
    id: int
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AdminLogBase(BaseModel):
    admin_user_id: int
    action: str
    resource_type: str
    resource_id: Optional[int] = None
    description: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class AdminLogCreate(AdminLogBase):
    pass

class AdminLog(AdminLogBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SystemSettingBase(BaseModel):
    setting_key: str
    setting_value: Optional[str] = None
    setting_type: Optional[str] = "string"
    description: Optional[str] = None
    category: Optional[str] = None
    is_public: Optional[bool] = False
    updated_by: Optional[int] = None

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSetting(SystemSettingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AdminNotificationBase(BaseModel):
    admin_user_id: int
    title: str
    message: str
    notification_type: str
    priority: Optional[str] = "normal"
    action_url: Optional[str] = None

class AdminNotificationCreate(AdminNotificationBase):
    pass

class AdminNotification(AdminNotificationBase):
    id: int
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True

class AdminDashboardBase(BaseModel):
    admin_user_id: int
    dashboard_name: str
    dashboard_config: Optional[str] = None
    is_default: Optional[bool] = False
    is_active: Optional[bool] = True

class AdminDashboardCreate(AdminDashboardBase):
    pass

class AdminDashboard(AdminDashboardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AdminReportBase(BaseModel):
    report_name: str
    report_type: str
    report_period: Optional[str] = None
    generated_by: int
    parameters: Optional[str] = None

class AdminReportCreate(AdminReportBase):
    pass

class AdminReport(AdminReportBase):
    id: int
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    status: str
    generated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Maps Service Schemas
class MapLocationBase(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    location_type: str
    category: Optional[str] = None
    rating: Optional[float] = None
    price_range: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    opening_hours: Optional[str] = None
    amenities: Optional[str] = None
    images: Optional[str] = None
    is_active: Optional[bool] = True
    is_verified: Optional[bool] = False
    created_by: Optional[int] = None

class MapLocationCreate(MapLocationBase):
    pass

class MapLocation(MapLocationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MapRouteBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_location_id: int
    end_location_id: int
    route_type: str
    distance_km: Optional[float] = None
    duration_minutes: Optional[int] = None
    route_data: Optional[str] = None
    waypoints: Optional[str] = None
    is_active: Optional[bool] = True
    created_by: Optional[int] = None

class MapRouteCreate(MapRouteBase):
    pass

class MapRoute(MapRouteBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MapAreaBase(BaseModel):
    name: str
    description: Optional[str] = None
    area_type: str
    boundary_data: str
    center_latitude: float
    center_longitude: float
    radius_km: Optional[float] = None
    population: Optional[int] = None
    attractions_count: Optional[int] = 0
    hotels_count: Optional[int] = 0
    restaurants_count: Optional[int] = 0
    is_active: Optional[bool] = True

class MapAreaCreate(MapAreaBase):
    pass

class MapArea(MapAreaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MapSearchBase(BaseModel):
    search_query: str
    search_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = None
    filters: Optional[str] = None
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class MapSearchCreate(MapSearchBase):
    pass

class MapSearch(MapSearchBase):
    id: int
    results_count: int
    created_at: datetime

    class Config:
        orm_mode = True

class MapFavoriteBase(BaseModel):
    user_id: int
    location_id: int
    favorite_type: Optional[str] = "location"
    notes: Optional[str] = None

class MapFavoriteCreate(MapFavoriteBase):
    pass

class MapFavorite(MapFavoriteBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class MapReviewBase(BaseModel):
    user_id: int
    location_id: int
    rating: int
    title: Optional[str] = None
    review_text: Optional[str] = None
    review_type: Optional[str] = "general"
    is_verified_visit: Optional[bool] = False
    visit_date: Optional[datetime] = None
    is_helpful: Optional[bool] = False
    helpful_count: Optional[int] = 0
    is_active: Optional[bool] = True

class MapReviewCreate(MapReviewBase):
    pass

class MapReview(MapReviewBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Videos Service Schemas
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_name: str
    file_path: str
    file_size: int
    duration_seconds: Optional[int] = None
    resolution: Optional[str] = None
    format: Optional[str] = None
    video_type: str
    category: Optional[str] = None
    tags: Optional[str] = None
    thumbnail_path: Optional[str] = None
    is_public: Optional[bool] = True
    is_featured: Optional[bool] = False
    status: Optional[str] = "active"
    uploaded_by: int
    related_location_id: Optional[int] = None
    related_booking_id: Optional[int] = None

class VideoCreate(VideoBase):
    pass

class Video(VideoBase):
    id: int
    view_count: int
    like_count: int
    dislike_count: int
    rating: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class VideoPlaylistBase(BaseModel):
    name: str
    description: Optional[str] = None
    playlist_type: str
    is_public: Optional[bool] = True
    is_featured: Optional[bool] = False
    created_by: int

class VideoPlaylistCreate(VideoPlaylistBase):
    pass

class VideoPlaylist(VideoPlaylistBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class VideoPlaylistItemBase(BaseModel):
    playlist_id: int
    video_id: int
    position: int
    added_by: int

class VideoPlaylistItemCreate(VideoPlaylistItemBase):
    pass

class VideoPlaylistItem(VideoPlaylistItemBase):
    id: int
    added_at: datetime

    class Config:
        orm_mode = True

class VideoViewBase(BaseModel):
    video_id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    view_duration_seconds: Optional[int] = None
    is_completed: Optional[bool] = False

class VideoViewCreate(VideoViewBase):
    pass

class VideoView(VideoViewBase):
    id: int
    viewed_at: datetime

    class Config:
        orm_mode = True

class VideoLikeBase(BaseModel):
    video_id: int
    user_id: int
    like_type: Optional[str] = "like"

class VideoLikeCreate(VideoLikeBase):
    pass

class VideoLike(VideoLikeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class VideoCommentBase(BaseModel):
    video_id: int
    user_id: int
    parent_comment_id: Optional[int] = None
    comment_text: str
    is_approved: Optional[bool] = True
    is_edited: Optional[bool] = False

class VideoCommentCreate(VideoCommentBase):
    pass

class VideoComment(VideoCommentBase):
    id: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class VideoShareBase(BaseModel):
    video_id: int
    user_id: int
    share_platform: str
    share_url: Optional[str] = None

class VideoShareCreate(VideoShareBase):
    pass

class VideoShare(VideoShareBase):
    id: int
    shared_at: datetime

    class Config:
        orm_mode = True

# Photos Service Schemas
class PhotoBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_name: str
    file_path: str
    file_size: int
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    photo_type: str
    category: Optional[str] = None
    tags: Optional[str] = None
    is_public: Optional[bool] = True
    is_featured: Optional[bool] = False
    is_approved: Optional[bool] = True
    uploaded_by: int
    related_location_id: Optional[int] = None
    related_booking_id: Optional[int] = None

class PhotoCreate(PhotoBase):
    pass

class Photo(PhotoBase):
    id: int
    view_count: int
    like_count: int
    download_count: int
    rating: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PhotoAlbumBase(BaseModel):
    name: str
    description: Optional[str] = None
    album_type: str
    cover_photo_id: Optional[int] = None
    is_public: Optional[bool] = True
    is_featured: Optional[bool] = False
    created_by: int

class PhotoAlbumCreate(PhotoAlbumBase):
    pass

class PhotoAlbum(PhotoAlbumBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PhotoAlbumItemBase(BaseModel):
    album_id: int
    photo_id: int
    position: int
    added_by: int

class PhotoAlbumItemCreate(PhotoAlbumItemBase):
    pass

class PhotoAlbumItem(PhotoAlbumItemBase):
    id: int
    added_at: datetime

    class Config:
        orm_mode = True

class PhotoViewBase(BaseModel):
    photo_id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class PhotoViewCreate(PhotoViewBase):
    pass

class PhotoView(PhotoViewBase):
    id: int
    viewed_at: datetime

    class Config:
        orm_mode = True

class PhotoLikeBase(BaseModel):
    photo_id: int
    user_id: int

class PhotoLikeCreate(PhotoLikeBase):
    pass

class PhotoLike(PhotoLikeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class PhotoCommentBase(BaseModel):
    photo_id: int
    user_id: int
    parent_comment_id: Optional[int] = None
    comment_text: str
    is_approved: Optional[bool] = True
    is_edited: Optional[bool] = False

class PhotoCommentCreate(PhotoCommentBase):
    pass

class PhotoComment(PhotoCommentBase):
    id: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PhotoDownloadBase(BaseModel):
    photo_id: int
    user_id: Optional[int] = None
    download_type: Optional[str] = "original"
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class PhotoDownloadCreate(PhotoDownloadBase):
    pass

class PhotoDownload(PhotoDownloadBase):
    id: int
    downloaded_at: datetime

    class Config:
        orm_mode = True

class PhotoShareBase(BaseModel):
    photo_id: int
    user_id: int
    share_platform: str
    share_url: Optional[str] = None

class PhotoShareCreate(PhotoShareBase):
    pass

class PhotoShare(PhotoShareBase):
    id: int
    shared_at: datetime

    class Config:
        orm_mode = True

# Reviews Service Schemas
class ReviewBase(BaseModel):
    user_id: int
    review_type: str
    entity_id: int
    entity_type: str
    rating: float
    title: Optional[str] = None
    review_text: str
    review_date: datetime
    visit_date: Optional[datetime] = None
    is_verified_visit: Optional[bool] = False
    is_helpful: Optional[bool] = False
    helpful_count: Optional[int] = 0
    is_approved: Optional[bool] = True
    is_edited: Optional[bool] = False
    edit_reason: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ReviewCategoryBase(BaseModel):
    review_id: int
    category_name: str
    rating: float
    weight: Optional[float] = 1.0

class ReviewCategoryCreate(ReviewCategoryBase):
    pass

class ReviewCategory(ReviewCategoryBase):
    id: int

    class Config:
        orm_mode = True

class ReviewImageBase(BaseModel):
    review_id: int
    image_path: str
    image_caption: Optional[str] = None
    is_approved: Optional[bool] = True

class ReviewImageCreate(ReviewImageBase):
    pass

class ReviewImage(ReviewImageBase):
    id: int
    uploaded_at: datetime

    class Config:
        orm_mode = True

class ReviewLikeBase(BaseModel):
    review_id: int
    user_id: int
    like_type: Optional[str] = "helpful"

class ReviewLikeCreate(ReviewLikeBase):
    pass

class ReviewLike(ReviewLikeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ReviewCommentBase(BaseModel):
    review_id: int
    user_id: int
    parent_comment_id: Optional[int] = None
    comment_text: str
    is_approved: Optional[bool] = True
    is_edited: Optional[bool] = False

class ReviewCommentCreate(ReviewCommentBase):
    pass

class ReviewComment(ReviewCommentBase):
    id: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ReviewReportBase(BaseModel):
    review_id: int
    reported_by: int
    report_reason: str
    report_description: Optional[str] = None
    status: Optional[str] = "pending"
    admin_notes: Optional[str] = None
    reviewed_by: Optional[int] = None

class ReviewReportCreate(ReviewReportBase):
    pass

class ReviewReport(ReviewReportBase):
    id: int
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True

class ReviewResponseBase(BaseModel):
    review_id: int
    responder_id: int
    responder_type: str
    response_text: str
    is_public: Optional[bool] = True
    is_approved: Optional[bool] = True

class ReviewResponseCreate(ReviewResponseBase):
    pass

class ReviewResponse(ReviewResponseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ReviewAnalyticsBase(BaseModel):
    entity_id: int
    entity_type: str
    total_reviews: Optional[int] = 0
    average_rating: Optional[float] = 0.0
    rating_distribution: Optional[str] = None
    category_ratings: Optional[str] = None
    helpful_reviews_count: Optional[int] = 0
    verified_reviews_count: Optional[int] = 0
    last_review_date: Optional[datetime] = None

class ReviewAnalyticsCreate(ReviewAnalyticsBase):
    pass

class ReviewAnalytics(ReviewAnalyticsBase):
    id: int
    updated_at: datetime

    class Config:
        orm_mode = True

# Chatbots schemas
class ChatbotBase(BaseModel):
    name: str
    description: Optional[str] = None
    chatbot_type: str
    model_name: Optional[str] = None
    api_key: Optional[str] = None
    webhook_url: Optional[str] = None
    welcome_message: Optional[str] = None
    fallback_message: Optional[str] = None
    is_active: bool = True
    language: str = "pt-BR"
    timezone: str = "America/Sao_Paulo"
    settings: Optional[dict] = None
    created_by: Optional[int] = None

class ChatbotCreate(ChatbotBase):
    pass

class ChatbotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    chatbot_type: Optional[str] = None
    model_name: Optional[str] = None
    api_key: Optional[str] = None
    webhook_url: Optional[str] = None
    welcome_message: Optional[str] = None
    fallback_message: Optional[str] = None
    is_active: Optional[bool] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    settings: Optional[dict] = None

class Chatbot(ChatbotBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ChatbotSessionBase(BaseModel):
    chatbot_id: int
    user_id: Optional[int] = None
    session_id: str
    platform: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    status: str = "active"
    total_messages: int = 0
    user_satisfaction: Optional[int] = None

class ChatbotSessionCreate(ChatbotSessionBase):
    pass

class ChatbotSessionUpdate(BaseModel):
    status: Optional[str] = None
    ended_at: Optional[datetime] = None
    total_messages: Optional[int] = None
    user_satisfaction: Optional[int] = None

class ChatbotSession(ChatbotSessionBase):
    id: int
    started_at: datetime
    ended_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ChatbotMessageBase(BaseModel):
    session_id: int
    message_type: str
    content: str
    sender: str
    intent_detected: Optional[str] = None
    confidence_score: Optional[float] = None
    response_time_ms: Optional[int] = None
    metadata: Optional[dict] = None

class ChatbotMessageCreate(ChatbotMessageBase):
    pass

class ChatbotMessage(ChatbotMessageBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ChatbotIntentBase(BaseModel):
    chatbot_id: int
    intent_name: str
    description: Optional[str] = None
    training_phrases: Optional[list] = None
    responses: Optional[list] = None
    parameters: Optional[dict] = None
    is_active: bool = True
    priority: int = 0

class ChatbotIntentCreate(ChatbotIntentBase):
    pass

class ChatbotIntentUpdate(BaseModel):
    intent_name: Optional[str] = None
    description: Optional[str] = None
    training_phrases: Optional[list] = None
    responses: Optional[list] = None
    parameters: Optional[dict] = None
    is_active: Optional[bool] = None
    priority: Optional[int] = None

class ChatbotIntent(ChatbotIntentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ChatbotResponseBase(BaseModel):
    chatbot_id: int
    intent_id: Optional[int] = None
    response_type: str
    content: str
    conditions: Optional[dict] = None
    is_default: bool = False
    is_active: bool = True

class ChatbotResponseCreate(ChatbotResponseBase):
    pass

class ChatbotResponseUpdate(BaseModel):
    response_type: Optional[str] = None
    content: Optional[str] = None
    conditions: Optional[dict] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None

class ChatbotResponse(ChatbotResponseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ChatbotTrainingBase(BaseModel):
    chatbot_id: int
    training_data: dict
    model_version: Optional[str] = None
    accuracy_score: Optional[float] = None
    training_status: str = "pending"
    training_logs: Optional[str] = None
    created_by: Optional[int] = None

class ChatbotTrainingCreate(ChatbotTrainingBase):
    pass

class ChatbotTrainingUpdate(BaseModel):
    accuracy_score: Optional[float] = None
    training_status: Optional[str] = None
    completed_at: Optional[datetime] = None
    training_logs: Optional[str] = None

class ChatbotTraining(ChatbotTrainingBase):
    id: int
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ChatbotAnalyticsBase(BaseModel):
    chatbot_id: int
    date: datetime
    total_sessions: int = 0
    total_messages: int = 0
    unique_users: int = 0
    avg_session_duration: float = 0.0
    avg_messages_per_session: float = 0.0
    intent_accuracy: float = 0.0
    user_satisfaction_avg: float = 0.0
    fallback_rate: float = 0.0
    response_time_avg: float = 0.0
    top_intents: Optional[dict] = None
    platform_distribution: Optional[dict] = None

class ChatbotAnalyticsCreate(ChatbotAnalyticsBase):
    pass

class ChatbotAnalytics(ChatbotAnalyticsBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True 