import {ReactComponent as Search} from '../../../../Public/Images/search.svg';
import {ReactComponent as Plus} from '../../../../Public/Images/plus.svg';
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import Button from "../../../../ui/Components/Button/Button";
import {useNavigate} from "react-router-dom";
import {generalModals} from "../../../../Infrastructure/const/modalNames";
import {generalLinks} from "../../../../Infrastructure/const/links";
import {useModal} from "../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../global.module.scss'
import {useTranslation} from "react-i18next";
import {useGetUser} from "../../../../Infrastructure/hooks/useGetUser";
import {Roles} from "../../../../Infrastructure/const/roles";
import {tKey} from "../../../../Infrastructure/i18n/tKey";


const OrderPanelTool = () => {

    const navigate = useNavigate();
    const {openModal} = useModal()
    const {t} = useTranslation();
    const user = useGetUser()
    return (
        <>
            {user && (user.user.role == Roles.SPEC_REALIZE_PRODUCT || user.user.role === Roles.ADMIN) &&
                <PanelTool>
                    <div className={`${globalStyles.container} ${globalStyles.flex_center} gap-3`}>
                        {user && user.user.role !== Roles.GUEST &&
                            <Button onClick={() => navigate(`./${generalLinks.createEditOrder}`)} SvgIcon={Plus}>
                                {tKey(t, 'general.create')}
                            </Button>
                        }
                        <Button SvgIcon={Search} onClick={() => openModal(generalModals.orderFilterModal)}>
                            {tKey(t, 'general.search')}
                        </Button>
                    </div>
                </PanelTool>

            }

        </>

    );
};

export default OrderPanelTool;